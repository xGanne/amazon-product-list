import express, { Request, Response } from 'express';
import axios from 'axios';
import { JSDOM } from 'jsdom';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Define interface for Product
interface Product {
  title: string;
  rating: number | null;
  reviewCount: number;
  imageUrl: string;
  productLink: string;
}

// Enable CORS to allow frontend to make requests
app.use(cors());

// Function to scrape Amazon search results
async function scrapeAmazonProducts(keyword: string): Promise<Product[]> {
  try {
    // Construct Amazon search URL
    const searchUrl = `https://www.amazon.com.br/s?k=${encodeURIComponent(keyword)}`;
    
    // Configure axios to mimic a browser request
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US,en;q=0.9',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });

    // Parse HTML with JSDOM
    const dom = new JSDOM(response.data);
    const document = dom.window.document;

    // Product selection strategies
    const productSelectors = [
      '.s-result-item[data-component-type="s/search/result"]',
      'div[data-component-type="s/search/result"]',
      '.a-section.a-spacing-base',
      '[data-cel-widget^="MAIN-SEARCH_RESULTS"]'
    ];

    let productElements: NodeListOf<Element> = document.querySelectorAll('div');
    for (const selector of productSelectors) {
      productElements = document.querySelectorAll(selector);
      if (productElements.length > 0) break;
    }

    console.log('Total product elements found:', productElements.length);

    // Extract products
    const products: Product[] = [];
    productElements.forEach((element, index) => {
      if (products.length >= 48) return;
      try {
        // Multiple strategies to extract title
        const titleSelectors = [
          'h2 a span', 
          '.a-size-base-plus.a-color-base.a-text-normal',
          'a .a-text-normal',
          '.a-size-medium.a-color-base.a-text-normal'
        ];

        let titleElement: Element | null = null;
        for (const selector of titleSelectors) {
          titleElement = element.querySelector(selector);
          if (titleElement) break;
        }

        const title = titleElement ? titleElement.textContent?.trim() || `Product ${index + 1}` : `Product ${index + 1}`;

        // Extract product link
        const linkSelectors = [
          'h2 a.a-link-normal',
          'a.a-link-normal',
          '.a-size-base-plus a'
        ];

        let linkElement: Element | null = null;
        for (const selector of linkSelectors) {
          linkElement = element.querySelector(selector);
          if (linkElement) break;
        }

        const productLink = linkElement 
          ? `https://www.amazon.com.br${linkElement.getAttribute('href') || '#'}` 
          : '#';

        // Extract rating
        const ratingSelectors = [
          '.a-icon-alt', 
          '.a-icon-star-small',
          '.a-icon-star'
        ];

        let ratingElement: Element | null = null;
        for (const selector of ratingSelectors) {
          ratingElement = element.querySelector(selector);
          if (ratingElement) break;
        }

        const rating = ratingElement 
          ? parseFloat(ratingElement.textContent?.split(' ')[0].replace(',', '.') || '0') 
          : null;

        // Extract review count
        const reviewSelectors = [
          '.a-size-base.s-underline-text',
          '.a-size-base.s-link-style',
          'span.a-size-base.s-underline-text'
        ];

        let reviewElement: Element | null = null;
        for (const selector of reviewSelectors) {
          reviewElement = element.querySelector(selector);
          if (reviewElement) break;
        }

        const reviewCount = reviewElement 
          ? parseInt(reviewElement.textContent?.replace(/[.,]/g, '') || '0') 
          : 0;

        // Extract image URL
        const imageSelectors = [
          '.s-image', 
          'img.a-dynamic-image',
          'img.product-image'
        ];

        let imageElement: Element | null = null;
        for (const selector of imageSelectors) {
          imageElement = element.querySelector(selector);
          if (imageElement) break;
        }

        const imageUrl = imageElement 
          ? (imageElement.getAttribute('src') || imageElement.getAttribute('data-src') || 'N/A')
          : 'N/A';

        // Add product if it has a title
        if (title && title !== 'N/A') {
          products.push({
            title,
            rating,
            reviewCount,
            imageUrl,
            productLink
          });
        }
      } catch (itemError) {
        console.error(`Error processing product ${index}:`, itemError);
      }
    });

    console.log('Extracted products:', products.length);
    return products;
  } catch (error) {
    console.error('Detailed scraping error:', error);
    throw new Error(`Failed to scrape Amazon products: ${error.message}`);
  }
}

// API endpoint for scraping
app.get('/api/scrape', async (req: Request, res: Response) => {
  try {
    const keyword = req.query.keyword as string;
    
    if (!keyword) {
      return res.status(400).json({ error: 'Keyword is required' });
    }

    const products = await scrapeAmazonProducts(keyword);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
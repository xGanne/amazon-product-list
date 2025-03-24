const API_URL = 'http://localhost:3000/api/scrape';

// DOM Elements
const keywordInput = document.getElementById('keywordInput');
const scrapeButton = document.getElementById('scrapeButton');
const resultsContainer = document.getElementById('resultsContainer');
const loader = document.getElementById('loader');

// Event Listener for Scrape Button
scrapeButton.addEventListener('click', async () => {
    const keyword = keywordInput.value.trim();
    
    if (!keyword) {
        alert('Please enter a search keyword');
        return;
    }

    // Clear previous results and show loader
    resultsContainer.innerHTML = '';
    loader.classList.add('visible');

    try {
        const response = await fetch(`${API_URL}?keyword=${encodeURIComponent(keyword)}`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Scraping error:', error);
        resultsContainer.innerHTML = `<p>Error: ${error.message}</p>`;
    } finally {
        loader.classList.remove('visible');
    }
});

// Function to display products
function displayProducts(products) {
    if (products.length === 0) {
        resultsContainer.innerHTML = '<p>No products found.</p>';
        return;
    }

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.title}">
            <h3>${truncateText(product.title, 50)}</h3>
            <p>Rating: ${product.rating ? product.rating + '/5' : 'N/A'}</p>
            <p>Reviews: ${product.reviewCount}</p>
        `;

        // Add click event to open product link
        productCard.addEventListener('click', () => {
            if (product.productLink && product.productLink !== '#') {
                window.open(product.productLink, '_blank');
            }
        });

        // Add cursor pointer style to indicate clickability
        productCard.style.cursor = 'pointer';

        resultsContainer.appendChild(productCard);
    });
}

// Utility function to truncate text
function truncateText(text, maxLength) {
    return text.length > maxLength 
        ? text.substring(0, maxLength) + '...' 
        : text;
}
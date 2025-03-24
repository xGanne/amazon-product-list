# Amazon Product Scraper

## Objective
This project is a web application that allows users to scrape product information directly from Amazon's Brazilian marketplace. With a simple interface, users can search for products and instantly retrieve key details such as title, rating, review count, and product image.

## Key Features
* 🔍 Search Amazon products by keyword
* 📊 Extract product details in real-time
* 💻 Clean, responsive user interface
* 🚀 Fast and efficient scraping mechanism

## Technology Stack

1. Backend:
* Node.js with Express
* Axios for HTTP requests
* JSDOM for HTML parsing


2. Frontend:
* Vanilla JavaScript
* HTML5
* CSS3

## Setup and Running Instructions

### Backend
1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2. Install the dependencies:
    ```sh
    bun install
    ```
3. Start the server:
    ```sh
    bun init
    ```
4. Start the server:
    ```sh
    bun add express axios jsdom cors
    ```
5. Start the server:
    ```sh
    bun run index.ts
    ```

### Frontend
1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install the dependencies:
    ```sh
    npm create vite@latest . --template vanilla
    ```
3. Start the development server:
    ```sh
    npm install
    ```
4. Start the development server:
    ```sh
    npm run dev
    ```

### Usage
1. Open the frontend application in your browser.
2. Enter a product keyword in the search input.
3. Click "Search" to retrieve product listings.
4. Browse through the extracted product information.

### Error Handling
The application includes robust error handling:
* Invalid search keywords
* Network request failures
* Parsing errors during web scraping
* HTML for debugging

## Ethical Considerations
⚠️ This scraper is for educational purposes. Always:
* Respect Amazon's Terms of Service
* Use responsibly
* Avoid excessive requests

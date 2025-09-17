#!/usr/bin/env python3
"""
Test script for Falabella.com web scraping
Tests if we can extract product data from the site
"""

import requests
from bs4 import BeautifulSoup
import json
import time
from typing import Dict, List, Optional

class FalabellaScraper:
    def __init__(self):
        self.base_url = "https://www.falabella.com/falabella-cl"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'es-CL,es;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Cache-Control': 'max-age=0'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def search_products(self, query: str, category: str = "") -> Optional[Dict]:
        """
        Search for products on Falabella
        """
        search_url = f"{self.base_url}/search?Ntt={query}"

        try:
            print(f"🔍 Searching for: {query}")
            print(f"URL: {search_url}")

            response = self.session.get(search_url, timeout=10)
            print(f"Status Code: {response.status_code}")

            if response.status_code == 200:
                return self.parse_search_results(response.text)
            else:
                print(f"❌ Failed to fetch data: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Error during request: {str(e)}")
            return None

    def parse_search_results(self, html: str) -> Dict:
        """
        Parse HTML and extract product information
        """
        soup = BeautifulSoup(html, 'html.parser')
        results = {
            'products': [],
            'total_found': 0
        }

        # Try to find products in common container patterns
        product_selectors = [
            'div[data-testid="product-pod"]',
            'div[class*="search-results-item"]',
            'div[class*="product-item"]',
            'article[class*="product"]',
            'div[class*="pod-item"]',
            'div[class*="ProductCard"]'
        ]

        products_found = False
        for selector in product_selectors:
            products = soup.select(selector)
            if products:
                print(f"✅ Found {len(products)} products with selector: {selector}")
                products_found = True

                for product in products[:5]:  # Limit to first 5 for testing
                    product_data = self.extract_product_data(product)
                    if product_data:
                        results['products'].append(product_data)
                break

        if not products_found:
            # Try to find if there's a script tag with product data
            scripts = soup.find_all('script', type='application/ld+json')
            for script in scripts:
                try:
                    data = json.loads(script.string)
                    if '@type' in data and data['@type'] == 'Product':
                        print("✅ Found product data in JSON-LD")
                        results['products'].append({
                            'name': data.get('name', 'Unknown'),
                            'price': data.get('offers', {}).get('price', 'N/A'),
                            'image': data.get('image', ''),
                            'description': data.get('description', '')[:200]
                        })
                except:
                    pass

            # Also check for Next.js data
            next_data = soup.find('script', id='__NEXT_DATA__')
            if next_data:
                print("ℹ️ Found Next.js data - site uses React/Next.js rendering")
                try:
                    data = json.loads(next_data.string)
                    print(f"Next.js build ID: {data.get('buildId', 'unknown')}")
                except:
                    pass

        results['total_found'] = len(results['products'])
        return results

    def extract_product_data(self, product_element) -> Optional[Dict]:
        """
        Extract data from a product element
        """
        try:
            product_info = {}

            # Try different patterns for name
            name_selectors = ['h2', 'h3', 'a[class*="name"]', 'span[class*="title"]', '[class*="product-name"]']
            for selector in name_selectors:
                name_elem = product_element.select_one(selector)
                if name_elem:
                    product_info['name'] = name_elem.get_text(strip=True)
                    break

            # Try different patterns for price
            price_selectors = ['span[class*="price"]', 'div[class*="price"]', '[data-testid*="price"]']
            for selector in price_selectors:
                price_elem = product_element.select_one(selector)
                if price_elem:
                    product_info['price'] = price_elem.get_text(strip=True)
                    break

            # Try to get image
            img = product_element.select_one('img')
            if img:
                product_info['image'] = img.get('src', img.get('data-src', ''))

            # Get link
            link = product_element.select_one('a')
            if link:
                href = link.get('href', '')
                if not href.startswith('http'):
                    href = f"https://www.falabella.com{href}"
                product_info['url'] = href

            return product_info if product_info else None

        except Exception as e:
            print(f"Error extracting product data: {e}")
            return None

    def test_api_endpoints(self):
        """
        Test if Falabella has accessible API endpoints
        """
        print("\n🔧 Testing potential API endpoints...")

        api_endpoints = [
            '/api/products/search',
            '/api/v1/search',
            '/api/catalog/search',
            '/rest/model/falabella/catalog/ProductCatalogActor/search',
            '/s/api/v1/search'
        ]

        for endpoint in api_endpoints:
            url = f"https://www.falabella.com{endpoint}"
            try:
                response = self.session.get(url, timeout=5)
                if response.status_code != 404:
                    print(f"✅ Found endpoint: {endpoint} (Status: {response.status_code})")
            except:
                pass

def main():
    print("="*50)
    print("🛍️ FALABELLA WEB SCRAPING TEST")
    print("="*50)

    scraper = FalabellaScraper()

    # Test searches for different holiday-related items
    test_queries = [
        "parrilla",  # For asados
        "regalo navidad",  # Christmas gifts
        "decoracion fiestas patrias"  # National holidays decoration
    ]

    for query in test_queries:
        print(f"\n{'='*50}")
        results = scraper.search_products(query)

        if results and results['products']:
            print(f"\n✅ Successfully found {results['total_found']} products for '{query}'")
            for i, product in enumerate(results['products'], 1):
                print(f"\n Product {i}:")
                for key, value in product.items():
                    if value:
                        print(f"  - {key}: {value[:100] if len(str(value)) > 100 else value}")
        else:
            print(f"\n⚠️ No products found or unable to parse results for '{query}'")
            print("This might be due to:")
            print("  1. Dynamic content loading (JavaScript)")
            print("  2. Anti-scraping measures")
            print("  3. Changed HTML structure")

        time.sleep(2)  # Be respectful with requests

    # Test for API endpoints
    scraper.test_api_endpoints()

    print(f"\n{'='*50}")
    print("📊 RECOMMENDATIONS:")
    print("If scraping doesn't work well, consider:")
    print("  1. Using Selenium for JavaScript-rendered content")
    print("  2. Looking for official API or affiliate program")
    print("  3. Using a scraping service like ScrapingBee or Scrapfly")
    print("  4. Checking if they have a mobile API that's easier to access")
    print("="*50)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Test MercadoLibre PUBLIC endpoints (no auth required)
Using the same endpoints that their website uses
"""

import requests
import json
from typing import Dict, List, Optional
import urllib.parse

class MercadoLibrePublicAPI:
    def __init__(self):
        self.session = requests.Session()
        # Mimic browser headers
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'es-419,es;q=0.9',
            'Referer': 'https://www.mercadolibre.cl/',
            'Origin': 'https://www.mercadolibre.cl'
        }
        self.session.headers.update(self.headers)

    def search_web_format(self, query: str) -> Optional[Dict]:
        """
        Use the same URL format as the website
        This mimics what happens when you search on mercadolibre.cl
        """
        # URL encode the query
        encoded_query = urllib.parse.quote(query)

        # Try different URL patterns that MercadoLibre uses
        urls = [
            f"https://listado.mercadolibre.cl/{encoded_query}",
            f"https://www.mercadolibre.cl/jm/search?as_word={encoded_query}",
            f"https://api.mercadolibre.com/sites/MLC/search?q={encoded_query}&limit=10"
        ]

        for url in urls:
            print(f"\n🔍 Testing URL: {url[:80]}...")

            try:
                response = self.session.get(url, timeout=10, allow_redirects=True)
                print(f"Status: {response.status_code}")

                if response.status_code == 200:
                    # Check if it's JSON
                    content_type = response.headers.get('content-type', '')

                    if 'application/json' in content_type:
                        data = response.json()
                        if 'results' in data:
                            return self.parse_api_response(data)
                        else:
                            print(f"JSON structure: {list(data.keys())[:5]}")

                    elif 'text/html' in content_type:
                        # It's HTML - look for embedded JSON data
                        return self.extract_from_html(response.text)

            except Exception as e:
                print(f"Error: {str(e)[:100]}")

        return None

    def extract_from_html(self, html: str) -> Optional[Dict]:
        """
        Extract product data from HTML response
        MercadoLibre embeds JSON data in their HTML
        """
        result = {'products': [], 'source': 'html'}

        # Look for common patterns in MercadoLibre HTML
        markers = [
            'window.__PRELOADED_STATE__ = ',
            'window.initialState = ',
            '__INITIAL_STATE__ = '
        ]

        for marker in markers:
            if marker in html:
                try:
                    start = html.index(marker) + len(marker)
                    # Find the end of the JSON object
                    end = html.index('</script>', start)
                    json_str = html[start:end].strip()

                    # Remove trailing semicolon if present
                    if json_str.endswith(';'):
                        json_str = json_str[:-1]

                    data = json.loads(json_str)
                    print(f"✅ Found embedded JSON with marker: {marker}")

                    # Navigate the structure to find products
                    if self.extract_products_from_state(data, result):
                        return result

                except (ValueError, json.JSONDecodeError) as e:
                    print(f"Failed to parse JSON: {str(e)[:100]}")

        print("❌ No embedded JSON data found in HTML")
        return None

    def extract_products_from_state(self, data: Dict, result: Dict) -> bool:
        """
        Navigate through the state object to find products
        """
        # Different possible paths to products in the state
        paths = [
            ['search_results', 'results'],
            ['results'],
            ['items'],
            ['products'],
            ['searchResults', 'items'],
            ['catalog', 'products']
        ]

        for path in paths:
            current = data
            for key in path:
                if isinstance(current, dict) and key in current:
                    current = current[key]
                else:
                    break
            else:
                # Successfully navigated the path
                if isinstance(current, list) and current:
                    print(f"✅ Found products at path: {' -> '.join(path)}")
                    for item in current[:5]:
                        product = self.extract_product_info(item)
                        if product:
                            result['products'].append(product)
                    return True

        return False

    def extract_product_info(self, item: Dict) -> Optional[Dict]:
        """Extract product information from item data"""
        try:
            return {
                'id': item.get('id', 'N/A'),
                'title': item.get('title', item.get('name', 'Unknown'))[:80],
                'price': self.format_price(item.get('price', item.get('price_info', {}))),
                'thumbnail': item.get('thumbnail', item.get('image', '')),
                'permalink': item.get('permalink', ''),
                'condition': item.get('condition', 'new'),
                'shipping': 'free' if item.get('shipping', {}).get('free_shipping') else 'paid'
            }
        except:
            return None

    def format_price(self, price_data) -> str:
        """Format price from various structures"""
        if isinstance(price_data, (int, float)):
            return f"${price_data:,.0f} CLP"
        elif isinstance(price_data, dict):
            amount = price_data.get('amount', price_data.get('value', 0))
            return f"${amount:,.0f} CLP"
        return "N/A"

    def parse_api_response(self, data: Dict) -> Dict:
        """Parse API JSON response"""
        result = {
            'products': [],
            'total': data.get('paging', {}).get('total', 0),
            'source': 'api'
        }

        for item in data.get('results', [])[:10]:
            product = {
                'id': item.get('id'),
                'title': item.get('title')[:80],
                'price': f"${item.get('price', 0):,.0f} CLP",
                'thumbnail': item.get('thumbnail'),
                'permalink': item.get('permalink'),
                'condition': item.get('condition'),
                'shipping': 'Envío gratis' if item.get('shipping', {}).get('free_shipping') else 'Envío pagado',
                'seller': item.get('seller', {}).get('nickname', 'Unknown')
            }
            result['products'].append(product)

        return result

    def test_direct_api(self):
        """
        Test direct API without auth
        Sometimes certain endpoints work without auth
        """
        print("\n" + "="*70)
        print("Testing Direct API Access (No Auth)")
        print("="*70)

        # Public endpoints that might work
        test_endpoints = [
            "https://api.mercadolibre.com/sites/MLC",  # Site info
            "https://api.mercadolibre.com/sites/MLC/categories",  # Categories
            "https://api.mercadolibre.com/currencies/CLP",  # Currency info
            "https://api.mercadolibre.com/sites/MLC/listing_types",  # Listing types
        ]

        for endpoint in test_endpoints:
            print(f"\nTesting: {endpoint}")
            try:
                response = requests.get(endpoint, timeout=5)
                print(f"Status: {response.status_code}")

                if response.status_code == 200:
                    data = response.json()
                    if isinstance(data, dict):
                        print(f"✅ Success! Keys: {list(data.keys())[:5]}")
                    elif isinstance(data, list):
                        print(f"✅ Success! Got {len(data)} items")
                        if data:
                            print(f"First item: {data[0].get('name', data[0])}")

            except Exception as e:
                print(f"❌ Error: {str(e)[:50]}")

def main():
    print("="*70)
    print("🛒 MERCADOLIBRE PUBLIC ACCESS TEST")
    print("="*70)

    api = MercadoLibrePublicAPI()

    # Test searches
    queries = [
        "parrilla",
        "vino",
        "televisor"
    ]

    for query in queries:
        print(f"\n{'='*70}")
        print(f"Searching for: '{query}'")
        print("="*70)

        result = api.search_web_format(query)

        if result and result['products']:
            print(f"\n✅ SUCCESS! Found {len(result['products'])} products")
            print(f"Source: {result['source']}")

            for i, product in enumerate(result['products'][:3], 1):
                print(f"\nProduct {i}:")
                print(f"  📦 {product['title']}")
                print(f"  💰 {product['price']}")
                print(f"  🚚 Shipping: {product.get('shipping', 'N/A')}")
                if product.get('permalink'):
                    print(f"  🔗 {product['permalink'][:60]}...")
        else:
            print("\n❌ Could not retrieve products")

    # Test direct API
    api.test_direct_api()

    print("\n" + "="*70)
    print("💡 FINAL RECOMMENDATIONS")
    print("="*70)
    print("""
Based on the tests:

1. 🔐 MercadoLibre API now requires authentication for searches
   - Need to register an app at https://developers.mercadolibre.cl/
   - Get App ID and Secret Key
   - Implement OAuth2 flow

2. 🌐 Alternative: Web Scraping with Selenium
   - Use headless browser to scrape the website
   - More reliable but slower

3. 🎯 Best Solution for Feriados24.cl:
   a) Register for MercadoLibre Developers account (free)
   b) Create an application
   c) Use the official API with proper auth
   d) Cache results in Supabase

4. 🤝 Or use affiliate/partner programs:
   - MercadoLibre Affiliates
   - Google Shopping API
   - Amazon Product Advertising API

5. 📱 Consider using their mobile app API
   - Sometimes has different auth requirements
   - Might be more permissive
    """)

if __name__ == "__main__":
    main()
#!/usr/bin/env python3
"""
Test Falabella API endpoint for product search
"""

import requests
import json
from typing import Dict, List, Optional

class FalabellaAPI:
    def __init__(self):
        self.base_url = "https://www.falabella.com"
        self.api_endpoint = "/rest/model/falabella/catalog/ProductCatalogActor/search"
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Accept-Language': 'es-CL,es;q=0.9',
            'Referer': 'https://www.falabella.com/falabella-cl',
            'Origin': 'https://www.falabella.com'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def search_products(self, query: str, page: int = 1, size: int = 20) -> Optional[Dict]:
        """Search products using the API endpoint"""

        # Try different parameter formats
        param_sets = [
            {
                'Ntt': query,
                'page': page,
                'size': size
            },
            {
                'searchTerm': query,
                'pageNumber': page,
                'resultsPerPage': size
            },
            {
                'q': query,
                'currentPage': page,
                'pageSize': size
            },
            {
                'keyword': query,
                'page': page,
                'limit': size
            }
        ]

        for i, params in enumerate(param_sets, 1):
            print(f"\n🔍 Attempt {i}/4 with params: {list(params.keys())}")

            try:
                response = self.session.get(
                    f"{self.base_url}{self.api_endpoint}",
                    params=params,
                    timeout=10
                )

                print(f"Status: {response.status_code}")

                if response.status_code == 200:
                    try:
                        data = response.json()
                        print(f"✅ Got JSON response!")
                        return self.parse_response(data)
                    except json.JSONDecodeError:
                        # Maybe it's HTML, let's check
                        if '<html' in response.text[:100]:
                            print("❌ Received HTML instead of JSON")
                        else:
                            print(f"Response preview: {response.text[:200]}...")
                else:
                    print(f"Response: {response.text[:200]}...")

            except Exception as e:
                print(f"❌ Error: {str(e)}")

        return None

    def parse_response(self, data: Dict) -> Dict:
        """Parse API response and extract product info"""

        result = {
            'success': True,
            'products': [],
            'total': 0
        }

        # Try different response structures
        possible_product_keys = [
            'products', 'items', 'results', 'data',
            'searchResults', 'productList', 'content'
        ]

        for key in possible_product_keys:
            if key in data:
                products_data = data[key]
                if isinstance(products_data, list):
                    print(f"Found products in key: '{key}'")
                    for product in products_data[:5]:  # First 5 products
                        result['products'].append(self.extract_product_info(product))
                    result['total'] = len(products_data)
                    break

        # If we didn't find products in simple structure, print the keys
        if not result['products']:
            print(f"Response structure keys: {list(data.keys())}")

            # Try to navigate nested structure
            if 'response' in data:
                return self.parse_response(data['response'])
            elif 'result' in data:
                return self.parse_response(data['result'])

        return result

    def extract_product_info(self, product: Dict) -> Dict:
        """Extract relevant product information"""

        # Common field mappings
        name_fields = ['name', 'title', 'productName', 'displayName', 'product_name']
        price_fields = ['price', 'salePrice', 'listPrice', 'pricing', 'currentPrice']
        image_fields = ['image', 'imageUrl', 'thumbnail', 'mainImage', 'primaryImage']

        info = {}

        # Extract name
        for field in name_fields:
            if field in product:
                info['name'] = product[field]
                break

        # Extract price
        for field in price_fields:
            if field in product:
                if isinstance(product[field], dict):
                    info['price'] = product[field].get('amount', product[field])
                else:
                    info['price'] = product[field]
                break

        # Extract image
        for field in image_fields:
            if field in product:
                info['image'] = product[field]
                break

        # Extract other useful fields
        info['id'] = product.get('id', product.get('productId', 'N/A'))
        info['brand'] = product.get('brand', product.get('brandName', ''))
        info['url'] = product.get('url', product.get('productUrl', ''))

        return info

    def test_mobile_api(self):
        """Test if there's a mobile API with different endpoints"""

        print("\n📱 Testing mobile API endpoints...")

        mobile_endpoints = [
            '/mobile-apps/api/v1/search',
            '/api/v1/products/search',
            '/api/search/products',
            '/fbch-api/search',
            '/s/api/v1/search-api/search'
        ]

        test_headers = {**self.headers}
        test_headers['User-Agent'] = 'Falabella/1.0 (iPhone; iOS 15.0)'

        for endpoint in mobile_endpoints:
            try:
                response = self.session.get(
                    f"{self.base_url}{endpoint}",
                    params={'q': 'test'},
                    headers=test_headers,
                    timeout=5
                )
                if response.status_code != 404:
                    print(f"✅ Found mobile endpoint: {endpoint} (Status: {response.status_code})")
            except:
                pass

def main():
    print("="*60)
    print("🛍️ FALABELLA API TEST")
    print("="*60)

    api = FalabellaAPI()

    # Test search
    test_queries = [
        "parrilla carbon",
        "vino tinto",
        "television samsung"
    ]

    for query in test_queries:
        print(f"\n{'='*60}")
        print(f"Searching for: '{query}'")

        result = api.search_products(query)

        if result and result.get('products'):
            print(f"\n✅ Found {result['total']} products!")
            for i, product in enumerate(result['products'], 1):
                print(f"\nProduct {i}:")
                for key, value in product.items():
                    if value:
                        print(f"  {key}: {value}")
        else:
            print("\n❌ No products found or unable to parse response")

    # Test mobile API
    api.test_mobile_api()

    print(f"\n{'='*60}")
    print("💡 ALTERNATIVE SOLUTIONS:")
    print("1. Use Selenium with Chrome driver for dynamic content")
    print("2. Look for Falabella's affiliate program (might have API)")
    print("3. Try MercadoLibre API (they have official API)")
    print("4. Use a headless browser service (Playwright, Puppeteer)")
    print("5. Contact Falabella for partnership/API access")
    print("="*60)

if __name__ == "__main__":
    main()
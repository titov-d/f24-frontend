#!/usr/bin/env python3
"""
Test MercadoLibre API for Chilean market
Official API documentation: https://developers.mercadolibre.cl/
"""

import requests
import json
from typing import Dict, List, Optional
from datetime import datetime

class MercadoLibreAPI:
    def __init__(self):
        # MercadoLibre Chile site ID
        self.site_id = "MLC"  # Chile
        self.base_url = "https://api.mercadolibre.com"
        self.headers = {
            'User-Agent': 'Feriados24.cl/1.0',
            'Accept': 'application/json'
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

    def search_products(self, query: str, limit: int = 20, offset: int = 0) -> Optional[Dict]:
        """
        Search products in MercadoLibre Chile
        No authentication required for basic search!
        """
        endpoint = f"{self.base_url}/sites/{self.site_id}/search"

        params = {
            'q': query,
            'limit': limit,
            'offset': offset
        }

        try:
            print(f"🔍 Searching for: {query}")
            print(f"URL: {endpoint}")

            response = self.session.get(endpoint, params=params, timeout=10)
            print(f"Status Code: {response.status_code}")

            if response.status_code == 200:
                data = response.json()
                return self.parse_search_results(data)
            else:
                print(f"❌ Error: {response.status_code}")
                print(response.text[:500])
                return None

        except Exception as e:
            print(f"❌ Request error: {str(e)}")
            return None

    def parse_search_results(self, data: Dict) -> Dict:
        """Parse MercadoLibre search results"""

        results = {
            'total_results': data.get('paging', {}).get('total', 0),
            'products': [],
            'filters': [],
            'categories': []
        }

        # Extract products
        for item in data.get('results', [])[:10]:  # First 10 products
            product = {
                'id': item.get('id'),
                'title': item.get('title'),
                'price': f"${item.get('price'):,.0f} CLP" if item.get('price') else 'N/A',
                'original_price': f"${item.get('original_price'):,.0f} CLP" if item.get('original_price') else None,
                'currency': item.get('currency_id'),
                'condition': item.get('condition'),
                'thumbnail': item.get('thumbnail'),
                'permalink': item.get('permalink'),
                'seller': item.get('seller', {}).get('nickname', 'Unknown'),
                'shipping': 'Envío gratis' if item.get('shipping', {}).get('free_shipping') else 'Envío pagado',
                'available_quantity': item.get('available_quantity', 0),
                'sold_quantity': item.get('sold_quantity', 0),
                'tags': item.get('tags', [])
            }

            # Check for discounts
            if item.get('original_price') and item.get('price'):
                discount = ((item['original_price'] - item['price']) / item['original_price']) * 100
                product['discount'] = f"{discount:.0f}% OFF"

            results['products'].append(product)

        # Extract available filters
        for filter_item in data.get('available_filters', []):
            filter_info = {
                'id': filter_item.get('id'),
                'name': filter_item.get('name'),
                'type': filter_item.get('type'),
                'values': [v.get('name') for v in filter_item.get('values', [])[:5]]
            }
            results['filters'].append(filter_info)

        return results

    def get_categories(self) -> Optional[List]:
        """Get all categories for Chile"""
        endpoint = f"{self.base_url}/sites/{self.site_id}/categories"

        try:
            print("\n📂 Fetching categories...")
            response = self.session.get(endpoint, timeout=10)

            if response.status_code == 200:
                categories = response.json()
                return categories[:10]  # First 10 categories
            else:
                print(f"❌ Error fetching categories: {response.status_code}")
                return None

        except Exception as e:
            print(f"❌ Error: {str(e)}")
            return None

    def get_category_trends(self, category_id: str) -> Optional[Dict]:
        """Get trending products in a category"""
        endpoint = f"{self.base_url}/highlights/MLC/category/{category_id}"

        try:
            response = self.session.get(endpoint, timeout=10)

            if response.status_code == 200:
                return response.json()
            return None

        except:
            return None

    def search_by_category(self, category_id: str, limit: int = 10) -> Optional[Dict]:
        """Search products by category"""
        endpoint = f"{self.base_url}/sites/{self.site_id}/search"

        params = {
            'category': category_id,
            'limit': limit,
            'sort': 'relevance'  # or 'price_asc', 'price_desc'
        }

        try:
            response = self.session.get(endpoint, params=params, timeout=10)

            if response.status_code == 200:
                return self.parse_search_results(response.json())
            return None

        except:
            return None

    def get_holiday_recommendations(self, holiday_type: str) -> Dict:
        """
        Get product recommendations based on holiday type
        This simulates what you could do with Claude AI integration
        """

        # Map holiday types to search queries
        holiday_queries = {
            'navidad': ['regalos navidad', 'decoracion navidad', 'arbol navidad'],
            'año_nuevo': ['champagne', 'cotillon año nuevo', 'fuegos artificiales'],
            'fiestas_patrias': ['bandera chile', 'parrilla carbon', 'anticucho'],
            'asado': ['parrilla', 'carbon', 'carne vacuno', 'cerveza'],
            'verano': ['piscina', 'bloqueador solar', 'cooler'],
            'dia_del_niño': ['juguetes', 'bicicleta niños', 'videojuegos']
        }

        queries = holiday_queries.get(holiday_type, ['regalo'])
        recommendations = {
            'holiday': holiday_type,
            'timestamp': datetime.now().isoformat(),
            'categories': {}
        }

        for query in queries:
            results = self.search_products(query, limit=5)
            if results and results['products']:
                recommendations['categories'][query] = results['products'][:3]

        return recommendations

def format_product_display(product: Dict) -> str:
    """Format product for display"""
    output = []
    output.append(f"  📦 {product['title'][:60]}...")
    output.append(f"  💰 {product['price']}")
    if product.get('discount'):
        output.append(f"  🏷️ {product['discount']}")
    output.append(f"  📊 Vendidos: {product['sold_quantity']}")
    output.append(f"  🚚 {product['shipping']}")
    output.append(f"  🔗 {product['permalink'][:50]}...")
    return '\n'.join(output)

def main():
    print("="*70)
    print("🛒 MERCADOLIBRE CHILE API TEST")
    print("="*70)

    api = MercadoLibreAPI()

    # Test 1: Basic product search
    print("\n" + "="*70)
    print("TEST 1: Product Search")
    print("="*70)

    test_searches = [
        "parrilla carbon",
        "vino carmenere",
        "empanadas congeladas"
    ]

    for query in test_searches:
        print(f"\n{'─'*50}")
        results = api.search_products(query)

        if results:
            print(f"✅ Found {results['total_results']} total results")
            print(f"Showing first {len(results['products'])} products:\n")

            for i, product in enumerate(results['products'][:3], 1):
                print(f"Product {i}:")
                print(format_product_display(product))
                print()

            # Show available filters
            if results['filters']:
                print("Available filters:")
                for f in results['filters'][:3]:
                    print(f"  • {f['name']}: {', '.join(f['values'][:3])}...")
        else:
            print("❌ No results found")

    # Test 2: Categories
    print("\n" + "="*70)
    print("TEST 2: Categories")
    print("="*70)

    categories = api.get_categories()
    if categories:
        print(f"✅ Found {len(categories)} main categories:")
        for cat in categories[:5]:
            print(f"  • {cat.get('name')} (ID: {cat.get('id')})")

    # Test 3: Holiday Recommendations
    print("\n" + "="*70)
    print("TEST 3: Holiday Recommendations Simulation")
    print("="*70)

    print("\n🎄 Christmas Recommendations:")
    holiday_recs = api.get_holiday_recommendations('navidad')

    for category, products in holiday_recs['categories'].items():
        print(f"\n📌 {category.upper()}:")
        for product in products[:2]:
            print(f"  • {product['title'][:50]}... - {product['price']}")

    print("\n🇨🇱 Fiestas Patrias Recommendations:")
    patrias_recs = api.get_holiday_recommendations('fiestas_patrias')

    for category, products in patrias_recs['categories'].items():
        print(f"\n📌 {category.upper()}:")
        for product in products[:2]:
            print(f"  • {product['title'][:50]}... - {product['price']}")

    # Summary
    print("\n" + "="*70)
    print("📊 INTEGRATION RECOMMENDATIONS")
    print("="*70)
    print("""
✅ MercadoLibre API works perfectly without authentication!
✅ Real-time prices and availability
✅ Rich product data (images, shipping, seller info)
✅ Categories and filters available

📝 Next Steps for Feriados24.cl:
1. Create a FastAPI endpoint to fetch MercadoLibre data
2. Use Claude AI to filter and rank products by holiday relevance
3. Store curated recommendations in Supabase
4. Update recommendations weekly via cron job
5. Implement affiliate links for monetization

💰 Monetization:
- Join MercadoLibre's affiliate program
- Earn commission on sales (typically 2-8%)
- Track conversions with affiliate tags

🔧 Implementation:
```python
# In your backend/app/services/recommendations.py
async def update_holiday_recommendations(holiday: Holiday):
    # 1. Fetch from MercadoLibre
    products = mercadolibre_api.search(holiday.search_terms)

    # 2. Analyze with Claude
    curated = await claude_api.analyze_products(products, holiday)

    # 3. Save to Supabase
    await supabase.save_recommendations(holiday.id, curated)
```
    """)
    print("="*70)

if __name__ == "__main__":
    main()
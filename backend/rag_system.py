import json
import os
import chromadb
from chromadb.config import Settings
from typing import List, Dict


class ChromaRAGSystem:
    def __init__(self):
        self.client = None
        self.collection = None
        self.customer_data = []
        self.product_data = []
        self.finance_data = []
        self.setup_chromadb()
        self.load_data()

    def setup_chromadb(self):
        """Initialize ChromaDB with persistent storage"""
        try:
            # Create persistent ChromaDB client
            self.client = chromadb.PersistentClient(
                path="./chroma_db",
                settings=Settings(
                    allow_reset=True,
                    anonymized_telemetry=False
                )
            )
            
            # Get or create collection (using default embeddings)
            try:
                self.collection = self.client.get_collection("marketbridge_customers")
                print("✅ Connected to existing ChromaDB collection")
            except Exception:
                self.collection = self.client.create_collection(
                    name="marketbridge_customers",
                    metadata={"description": "MarketBridge customer profiles for RAG"}
                )
                print("✅ Created new ChromaDB collection")
            
            print(f"📊 ChromaDB collection has {self.collection.count()} documents")
            
        except Exception as e:
            print(f"❌ ChromaDB setup error: {e}")
            self.client = None
            self.collection = None

    def load_data(self):
        """Load data and populate ChromaDB if needed"""
        try:
            # Load customer data from JSON
            self.customer_data = self.load_customer_data()
            self.product_data = self.load_product_data()
            self.finance_data = self.load_finance_data()
            
            # Populate ChromaDB if empty or outdated
            if self.collection and self.collection.count() < len(self.customer_data):
                self.populate_chromadb()
                
            print(f"✅ Enhanced ChromaDB RAG System loaded: {len(self.customer_data)} customers, {len(self.product_data)} products")
            
        except Exception as e:
            print(f"❌ Data loading error: {e}")

    def populate_chromadb(self):
        """Populate ChromaDB with customer data (FIXED for metadata types)"""
        print("🔄 Populating ChromaDB with customer data...")
        
        documents = []
        metadatas = []
        ids = []
        
        for customer in self.customer_data:
            # Create searchable document text
            interests_text = ', '.join(customer.get('interests', [])) if isinstance(customer.get('interests', []), list) else str(customer.get('interests', ''))
            
            doc_text = f"""
            {customer.get('demographics', '')} {customer.get('preferences', '')} 
            {interests_text} age {customer.get('age', 0)} 
            income {customer.get('income', 0)} {customer.get('location', '')}
            """.strip()
            
            # Convert customer metadata to ChromaDB-compatible format
            safe_metadata = {}
            for key, value in customer.items():
                if isinstance(value, list):
                    # Convert lists to comma-separated strings
                    safe_metadata[key] = ', '.join(map(str, value))
                elif isinstance(value, (str, int, float, bool)) or value is None:
                    # Keep supported types as-is
                    safe_metadata[key] = value
                else:
                    # Convert other types to string
                    safe_metadata[key] = str(value)
            
            documents.append(doc_text)
            metadatas.append(safe_metadata)
            ids.append(f"customer_{customer.get('id', customer.get('name', 'unknown'))}")
        
        # Add to ChromaDB
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        print(f"✅ Added {len(documents)} customers to ChromaDB")

    def find_relevant_customers(self, product: str, query: str, top_k: int = 10) -> List[Dict]:
        """ChromaDB-powered customer search with hybrid scoring"""
        print(f"🔍 CHROMADB SEARCH: '{query}' | PRODUCT: '{product}'")
        
        if not self.collection:
            print("⚠️ ChromaDB not available, using fallback")
            return self.fallback_customer_search(product, query)
        
        try:
            # Search ChromaDB
            search_query = f"{query} {product}"
            
            results = self.collection.query(
                query_texts=[search_query],
                n_results=min(top_k, self.collection.count()),
                include=['documents', 'metadatas', 'distances']
            )
            
            print(f"📊 ChromaDB returned {len(results['ids'][0])} results")
            
            # Convert results and add scoring
            relevant_customers = []
            
            for i, (customer_id, document, metadata, distance) in enumerate(zip(
                results['ids'][0], results['documents'][0], 
                results['metadatas'][0], results['distances'][0]
            )):
                # Semantic similarity score
                semantic_score = max(0, 1.0 - distance) * 10
                
                # Keyword-based scoring
                keyword_score = self.calculate_keyword_score(metadata, query)
                
                # Total score
                total_score = semantic_score + keyword_score
                
                customer = metadata.copy()
                customer['relevance_score'] = round(total_score, 2)
                relevant_customers.append(customer)
                
                print(f"🎯 {metadata.get('name', 'Unknown')}: Score={total_score:.1f}")
            
            # Sort by score
            relevant_customers.sort(key=lambda x: x['relevance_score'], reverse=True)
            
            return relevant_customers
            
        except Exception as e:
            print(f"❌ ChromaDB search error: {e}")
            return self.fallback_customer_search(product, query)

    def calculate_keyword_score(self, customer: dict, query: str) -> int:
        """Keyword scoring logic"""
        score = 0
        query_lower = query.lower()
        demographics = customer.get('demographics', '').lower()
        age = customer.get('age', 25)
        income = customer.get('income', 50000)
        
        # Executive keywords
        if any(kw in query_lower for kw in ['executive', 'business', 'professional', 'premium', 'luxury']):
            if any(word in demographics for word in ['executive', 'manager', 'business', 'ceo']):
                score += 15
            elif income > 100000:
                score += 12
                
        # Student keywords
        elif any(kw in query_lower for kw in ['student', 'college', 'budget', 'affordable', 'cheap']):
            if any(word in demographics for word in ['student', 'college', 'university']):
                score += 15
            elif age < 25:
                score += 12
                
        # Creative keywords
        elif any(kw in query_lower for kw in ['designer', 'creative', 'stylish', 'aesthetic']):
            if any(word in demographics for word in ['designer', 'creative', 'artist']):
                score += 15
        
        return score

    def fallback_customer_search(self, product: str, query: str) -> List[Dict]:
        """Fallback when ChromaDB fails"""
        print("⚠️ Using fallback customer search")
        relevant_customers = []
        
        for customer in self.customer_data:
            score = self.calculate_keyword_score(customer, query)
            if score > 0:
                customer_copy = customer.copy()
                customer_copy['relevance_score'] = score
                relevant_customers.append(customer_copy)
        
        return sorted(relevant_customers, key=lambda x: x['relevance_score'], reverse=True)

    def get_customer_segments(self, product: str, query: str, segment_type: str) -> Dict:
        """Customer segmentation using ChromaDB"""
        relevant_customers = self.find_relevant_customers(product, query)
        
        if not relevant_customers:
            relevant_customers = self.get_fallback_customers()
        
        primary_customers = relevant_customers[:3]
        secondary_customers = relevant_customers[3:6]
        
        primary_insights = self.calculate_segment_insights(primary_customers, "primary")
        secondary_insights = self.calculate_segment_insights(secondary_customers, "secondary")
        
        return {
            'insights': {
                'primary': primary_insights,
                'secondary': secondary_insights
            },
            'segments': {
                'primary': primary_customers,
                'secondary': secondary_customers
            }
        }

    def calculate_segment_insights(self, customers: List[Dict], segment_type: str) -> Dict:
        """Calculate market insights"""
        if not customers:
            return {'estimated_reach': 25000, 'projected_conversions': 75, 'avg_age': 28, 'confidence': 0.7}
        
        total_customers = len(customers)
        avg_age = sum(customer.get('age', 28) for customer in customers) / total_customers
        avg_income = sum(customer.get('income', 75000) for customer in customers) / total_customers
        
        base_reach = 35000 if segment_type == 'primary' else 20000
        estimated_reach = int(base_reach * (1 + (avg_income - 75000) / 100000))
        
        base_conversion_rate = 0.035 if segment_type == 'primary' else 0.025
        projected_conversions = int(estimated_reach * base_conversion_rate)
        
        return {
            'estimated_reach': estimated_reach,
            'projected_conversions': projected_conversions,
            'avg_age': int(avg_age),
            'avg_income': int(avg_income),
            'conversion_rate': base_conversion_rate,
            'confidence': 0.85 if segment_type == 'primary' else 0.75
        }

    def load_customer_data(self):
        """Load customer data from JSON"""
        base_dir = os.path.dirname(os.path.abspath(__file__))
        customer_path = os.path.join(base_dir, "data", "customers.json")
        
        try:
            with open(customer_path, 'r') as f:
                data = json.load(f)
                customers = data.get("customers", [])
                print(f"📂 Loaded {len(customers)} customers from JSON file")
                return customers
        except Exception as e:
            print(f"❌ Error loading customers.json: {e}")
            return self.get_fallback_customers()

    def load_product_data(self):
        """Load product data"""
        return [
            {"name": "Wireless Headphones", "stock": 250, "price": 180, "category": "Audio"},
            {"name": "Smart Watch", "stock": 180, "price": 250, "category": "Wearables"},
            {"name": "Professional Headphones", "stock": 300, "price": 160, "category": "Electronics"}
        ]

    def load_finance_data(self):
        """Load finance data"""
        return [{"total_budget": 50000, "allocated": 15000}]

    def get_fallback_customers(self):
        """Fallback customers"""
        return [
            {
                "id": "F001", "name": "Tech Executive", "age": 42, "income": 150000,
                "demographics": "executive, high income, luxury buyer, business traveler", 
                "interests": ["Technology", "Business", "Travel"], 
                "preferences": "Premium quality, professional appearance"
            },
            {
                "id": "F002", "name": "College Student", "age": 21, "income": 25000,
                "demographics": "student, budget-conscious, social media active, Gen Z", 
                "interests": ["Social Media", "Music", "Gaming"], 
                "preferences": "Value for money, trendy designs"
            },
            {
                "id": "F003", "name": "Graphic Designer", "age": 28, "income": 65000,
                "demographics": "creative professional, designer, freelancer", 
                "interests": ["Design", "Art", "Photography"], 
                "preferences": "Aesthetic appeal, creative tools"
            }
        ]

    def search_products(self, product_name: str, top_k: int = 3) -> List[Dict]:
        """Product search"""
        matching_products = []
        for product in self.product_data:
            if product_name.lower() in product.get('name', '').lower():
                matching_products.append(product)
        return matching_products[:top_k] if matching_products else [{'name': product_name, 'stock': 300, 'price': 160}]


# Initialize ChromaDB RAG system
_rag_instance = None

def get_rag_system():
    """Get ChromaDB RAG system singleton"""
    global _rag_instance
    if _rag_instance is None:
        _rag_instance = ChromaRAGSystem()
    return _rag_instance

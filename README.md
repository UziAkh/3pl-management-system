3PL Management System
A warehouse inventory management system for third-party logistics (3PL) providers, built with Node.js, Express, and Supabase. Now featuring real-time UPC scanning and automated product identification!
🚀 Current Status
The application now includes:

Express.js backend API with comprehensive inventory management
Supabase database integration with real-time updates
Modern web interface with responsive design
NEW: Daily receiving system with UPC barcode scanning
NEW: Automatic product name lookup via UPC database
NEW: Client-specific inventory tracking
NEW: Real-time transaction processing
Full CRUD operations for clients, products, and transactions

📁 Project Structure
3pl-management-system/
├── .env                  # Environment variables (not in repo)
├── package.json          # Project dependencies
├── public/               # Frontend assets
│   ├── index.html        # Main dashboard interface
│   ├── js/               # Client-side JavaScript modules
│   │   ├── main.js       # Core functionality
│   │   ├── clients.js    # Client management
│   │   ├── products.js   # Product management
│   │   ├── transactions.js # Transaction handling
│   │   └── receiving.js  # NEW: Daily receiving system
│   └── css/              # Styling (if applicable)
├── src/                  # Server-side code
│   ├── index.js          # Main application entry point
│   ├── config/           # Configuration files
│   │   └── supabase.js   # Supabase client configuration
│   ├── controllers/      # API controllers
│   │   ├── clientController.js
│   │   ├── productController.js
│   │   └── transactionController.js
│   └── routes/           # API routes
│       ├── clientRoutes.js
│       ├── productRoutes.js
│       ├── transactionRoutes.js
│       └── upcRoutes.js  # NEW: UPC lookup endpoints
✨ Key Features
📱 Daily Receiving System (NEW!)

UPC Barcode Scanning: Scan any product barcode for instant identification
Automatic Product Lookup: Real-time product name and brand identification
Client-Specific Sessions: Organize inventory by client during receiving
Real-Time Inventory Updates: Instant stock level adjustments
Session Management: Track receiving sessions with timestamps and references

👥 Client Management

View, add, edit, and delete clients
Client-specific inventory tracking
Contact information and address management
Active/inactive status control

📦 Product Management

Comprehensive product catalog with UPC support
Auto-Generated Product Names: No more "Unknown Product" entries!
Client-specific product filtering
SKU and UPC barcode management
Stock level monitoring with status indicators

🔄 Inventory Transactions

Automated Inbound Processing: Scan products to receive inventory
Outbound Transaction Support: Track shipments and stock reductions
Complete transaction history with audit trails
Reference numbers and notes for tracking

📊 Real-Time Dashboard

Live inventory status across all clients
Recent activity monitoring
Stock alerts (low stock, out of stock warnings)
Performance metrics and analytics

🗄️ Database Schema
clients

id (UUID, primary key)
name, code (unique identifier)
contact_name, email, phone
address fields (street, city, state, zip, country)
active (boolean), notes
timestamps (created_at, updated_at)

products

id (UUID, primary key)
name, sku (unique), upc (barcode)
client_id (foreign key)
description, quantity
timestamps (created_at, updated_at)

transactions

id (UUID, primary key)
type ('inbound'/'outbound')
product_id (foreign key)
quantity, previous_quantity, new_quantity
reference, notes, created_by
created_at timestamp

🔌 API Endpoints
Clients

GET /api/clients - Get all clients
GET /api/clients/:id - Get specific client
POST /api/clients - Create new client
PUT /api/clients/:id - Update client
DELETE /api/clients/:id - Delete client

Products

GET /api/products - Get all products
GET /api/products?clientId=:id - Get client-specific products
GET /api/products/:id - Get specific product
GET /api/products/upc/:upc - Find product by UPC
POST /api/products - Create new product
PUT /api/products/:id - Update product
DELETE /api/products/:id - Delete product

Transactions

GET /api/transactions - Get all transactions
GET /api/transactions?type=:type - Filter by transaction type
GET /api/transactions/product/:productId - Get product transaction history
POST /api/transactions/inbound - Create inbound transaction
POST /api/transactions/outbound - Create outbound transaction

UPC Lookup (NEW!)

GET /api/upc/lookup/:upc - Get product information from UPC database

🛠️ Setup and Installation

Clone the repository

bashgit clone https://github.com/YourUsername/3pl-management-system.git
cd 3pl-management-system

Install dependencies

bashnpm install

Set up environment variables
Create a .env file with your Supabase credentials:

bashPORT=3001
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key

Start the development server

bashnpm run dev

Access the application
Open your browser to http://localhost:3001

🚀 Daily Usage Workflow
Morning Receiving Process

Navigate to Receiving tab
Select client from dropdown
Start receiving session
Scan product UPCs - system automatically:

Identifies product names and brands
Creates new products if needed
Updates inventory quantities
Records transaction history


Switch clients as needed for different shipments
Finish session when complete

Real-Time Benefits

No more manual product entry
Instant inventory updates
Automated audit trails
Client-specific organization
Real-time stock visibility

🔮 Future Enhancements
Phase 1: Enhanced Receiving

 Bulk UPC scanning interface
 Mobile-optimized scanning interface
 Barcode scanner hardware integration
 Photo capture for product verification
 Multi-location warehouse support

Phase 2: Advanced Features

 User authentication and role-based access
 Advanced reporting and analytics
 Email notifications for low stock alerts
 Integration with shipping carriers (UPS, FedEx)
 Automated reorder point management

Phase 3: Business Intelligence

 Inventory forecasting and analytics
 Client profitability analysis
 Seasonal trend identification
 Performance dashboards and KPIs
 API integrations with e-commerce platforms

Phase 4: Automation & AI

 Predictive inventory management
 Automated product categorization
 Smart receiving recommendations
 Machine learning for demand forecasting
 IoT sensor integration for real-time tracking

🏗️ Technical Architecture
Frontend

Vanilla JavaScript with modular design
Responsive CSS for mobile compatibility
Real-time UI updates via fetch API
Progressive Web App capabilities (planned)

Backend

Node.js with Express.js framework
RESTful API design principles
Comprehensive error handling and logging
Modular controller and route structure

Database

Supabase (PostgreSQL) for data persistence
Real-time subscriptions capabilities
Row-level security (to be implemented)
Automatic backups and scaling

External Integrations

UPCitemdb.com for product lookup
OpenFoodFacts as backup product database
Future: Multiple UPC providers for redundancy

📈 Performance & Scalability
Current Capabilities

Handles multiple concurrent receiving sessions
Real-time inventory updates across all connected clients
Efficient UPC lookup with error handling
Responsive interface for various screen sizes

Optimization Opportunities

Implement caching for frequent UPC lookups
Add database indexing for improved query performance
Optimize frontend bundling and loading
Add service worker for offline capabilities

🤝 Contributing
This project follows standard Git workflows:

Create feature branches for new functionality
Use descriptive commit messages
Test all changes locally before pushing
Update documentation for new features

📄 License
ISC License - See package.json for details

🎯 Business Impact
Time Savings:

Eliminates manual product name entry
Reduces weekly photo documentation
Streamlines daily receiving process

Accuracy Improvements:

Automatic product identification
Real-time inventory tracking
Complete audit trails

Client Experience:

Real-time inventory visibility
Professional product presentation
Accurate stock information

Operational Benefits:

Scalable multi-client support
Comprehensive transaction history
Modern, intuitive interface


Built with ❤️ for efficient 3PL operations


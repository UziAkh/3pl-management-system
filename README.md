3PL Management System
A comprehensive warehouse inventory management system for third-party logistics (3PL) providers, built with Node.js, Express, and Supabase.
🚀 Current Status - Production Ready!
The application is now a fully functional 3PL management system with:

✅ Complete receiving workflow with external UPC API integration
✅ Professional outbound fulfillment system
✅ Real-time inventory tracking with transaction history
✅ NEW: Complete shipments management with detailed tracking
✅ Multi-client support with proper data isolation
✅ Professional web interface with responsive design

📦 Key Features
🔄 Receiving System

Smart UPC Scanning: Automatically lookup products using external UPCitemdb.com API
Auto Product Creation: Unknown products are automatically created with real product names
Client-Specific Sessions: Receive inventory for specific clients with session management
Real-time Updates: Inventory quantities update immediately upon scanning

🚚 Outbound Fulfillment

Multi-Step Workflow: Client selection → Product scanning → Box selection → Cost calculation
Inventory Validation: Prevents overselling with real-time stock checks
Box Cost Calculation: Automatic fulfillment fees + box costs
Complete Shipment Records: Every shipment creates comprehensive tracking records

🚢 Shipments Management ⭐ NEW

Complete Shipment Tracking: View all shipments with client, cost, and timing details
Advanced Filtering: Filter by client, date ranges (today, week, month)
Detailed Views: Click any shipment to see individual products shipped
Professional Interface: Beautiful card-based display with modal details
Business Intelligence: Summary statistics and shipment analytics

👥 Client Management

Multi-Client Architecture: Complete isolation between client inventories
CRUD Operations: Create, read, update, and delete client records
Contact Management: Store client contact information and addresses

📋 Product Management

Client-Specific Inventory: Same products can exist for multiple clients separately
SKU & UPC Support: Full barcode and SKU tracking
Stock Level Monitoring: Real-time inventory quantities with low stock alerts
Product Details: Names, descriptions, and specifications

📊 Transaction History

Complete Audit Trail: Every inventory movement is tracked
Inbound/Outbound Tracking: Separate flows for receiving and shipping
Reference Numbers: Link transactions to specific orders or shipments

🏗️ Technical Architecture
Database Schema
sql-- Core business entities
clients (id, name, code, contact_info, address, active, timestamps)
products (id, name, sku, upc, client_id, description, quantity, timestamps)
box_types (id, name, barcode, price, dimensions, description, active, timestamps)

-- Transaction tracking
transactions (id, type, product_id, quantity, previous_quantity, new_quantity, reference, notes, timestamps)

-- NEW: Complete shipment tracking
shipments (id, client_id, total_cost, box_type_id, reference, notes, timestamps)
shipment_items (id, shipment_id, product_id, quantity, timestamps)
Technology Stack

Backend: Node.js, Express.js
Database: Supabase (PostgreSQL)
Frontend: Vanilla JavaScript, HTML5, CSS3
External APIs: UPCitemdb.com for product lookup
Architecture: RESTful API with responsive web interface

Project Structure
3pl-management-system/
├── public/                 # Frontend assets
│   ├── js/
│   │   ├── main.js        # Core functionality
│   │   ├── dashboard.js   # Dashboard statistics
│   │   ├── clients.js     # Client management
│   │   ├── products.js    # Product management
│   │   ├── transactions.js # Outbound fulfillment
│   │   ├── receiving.js   # Receiving workflow
│   │   └── shipments.js   # 🆕 Shipments management
│   ├── css/               # Styling
│   └── index.html         # Main interface
├── src/                   # Backend API
│   ├── controllers/       # Business logic
│   │   ├── clientController.js
│   │   ├── productController.js
│   │   ├── transactionController.js
│   │   └── shipmentController.js  # 🆕 Shipment operations
│   ├── routes/            # API endpoints
│   │   ├── clientRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── shipmentRoutes.js      # 🆕 Shipment endpoints
│   ├── config/
│   │   └── supabase.js    # Database configuration
│   └── index.js           # Server entry point
├── package.json
└── README.md
🛠️ API Endpoints
Clients

GET /api/clients - Get all clients
GET /api/clients/:id - Get specific client
POST /api/clients - Create new client
PUT /api/clients/:id - Update client
DELETE /api/clients/:id - Delete client

Products

GET /api/products - Get all products
GET /api/products?clientId=:clientId - Get products for specific client
GET /api/products/:id - Get specific product
GET /api/products/upc/:upc - Get product by UPC
POST /api/products - Create new product
PUT /api/products/:id - Update product
DELETE /api/products/:id - Delete product

Transactions

GET /api/transactions - Get all transactions
GET /api/transactions?type=:type - Filter by transaction type
GET /api/transactions/product/:productId - Get product transaction history
POST /api/transactions/inbound - Create inbound (receiving) transaction
POST /api/transactions/outbound - Create outbound (shipping) transaction

🆕 Shipments

GET /api/shipments - Get all shipments with client/box details
GET /api/shipments/:id/items - Get detailed shipment contents
POST /api/shipments - Create new shipment record
POST /api/shipments/shipment-items - Add items to shipment

System

GET /api/health - API health check

🚀 Setup and Installation
Prerequisites

Node.js (v18 or higher)
Supabase account
Git

Installation Steps

Clone the repository
bashgit clone https://github.com/UziAkh/3pl-management-system.git
cd 3pl-management-system

Install dependencies
bashnpm install

Environment Configuration
Create a .env file in the root directory:
envPORT=3001
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key

Database Setup
Run the provided SQL scripts in your Supabase SQL Editor to create the required tables:

Core tables: clients, products, box_types, transactions
Shipment tables: shipments, shipment_items


Start the application
bash# Development mode
npm run dev

# Production mode
npm start

Access the application
Open your browser to http://localhost:3001

💼 Business Workflows
Daily Receiving Process

Select client for receiving session
Scan product UPCs (or enter manually)
System automatically looks up product names via external API
Unknown products are created automatically
Inventory quantities update in real-time
Complete receiving session when finished

Order Fulfillment Process

Select client to ship for
Scan product UPCs to build shipment
System validates inventory availability
Scan shipping box barcode
Review costs (fulfillment fees + box costs)
Complete shipment to create comprehensive records
Inventory automatically deducted

Shipment Management

View all shipments in professional card interface
Filter by client or date range
Click "View Details" for complete shipment breakdown
See all products shipped with quantities and details
Access shipment summary statistics

📈 Business Intelligence
Dashboard Metrics

Total clients across all locations
Products tracked across all clients
Recent transaction activity
Low stock alerts and inventory status

Shipment Analytics 🆕

Total shipments processed
Shipment filtering by client and date
Detailed shipment breakdowns
Cost analysis and profitability tracking

🔮 Roadmap
Phase 1: Enhanced Data Management

Delete Functionality: Safe deletion of clients, products, and shipments with referential integrity
Advanced Validation: Enhanced form validation and duplicate detection
Bulk Operations: Import/export capabilities for large data sets

Phase 2: Advanced Analytics

Interactive Dashboards: Charts and graphs for business insights
Performance Metrics: Client activity analysis and productivity reports
Predictive Analytics: Inventory forecasting and demand planning

Phase 3: Enterprise Features

User Authentication: Multi-user support with role-based access
API Integration: Connect with external WMS, ERP, and shipping systems
Mobile Applications: Dedicated mobile apps for warehouse operations
Advanced Reporting: Custom reports and automated business intelligence

Phase 4: Scalability & Automation

Automated Workflows: Rule-based inventory management
Email Notifications: Automated alerts for low stock, shipments, etc.
Advanced Barcode Support: Support for additional barcode formats
Multi-location Support: Manage multiple warehouse locations

🤝 Contributing
This project is actively developed for real-world 3PL operations. Contributions are welcome!
Development Setup

Fork the repository
Create a feature branch
Make your changes
Test thoroughly
Submit a pull request

Coding Standards

Use consistent JavaScript ES6+ syntax
Follow RESTful API design principles
Maintain responsive design principles
Include proper error handling
Document all new features

📄 License
ISC License - See LICENSE file for details
📞 Support
For questions, issues, or feature requests:

Open an issue on GitHub
Check the documentation in the README
Review the API endpoints for integration questions


Built for real 3PL operations with scalability and professionalism in mind. 🏭📦
This system successfully manages inventory for multiple clients with complete audit trails, professional interfaces, and comprehensive shipment tracking.


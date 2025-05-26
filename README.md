# 3PL Management System

A comprehensive warehouse inventory management system for third-party logistics (3PL) providers, built with Node.js, Express, and Supabase.

## 🚀 Current Status

The application features a fully functional warehouse management system with:
- **Express.js backend API** with robust REST endpoints
- **Supabase database integration** for scalable data management
- **Modern responsive frontend** with client-side JavaScript
- **Complete CRUD operations** for clients, products, and transactions
- **Advanced receiving system** with real-time UPC lookup
- **External API integration** for product information retrieval

## 📁 Project Structure
```
3pl-management-system/
├── .env                  # Environment variables (not in repo)
├── package.json          # Project dependencies
├── public/               # Static files served by Express
│   ├── index.html        # Main frontend interface
│   ├── css/              # Stylesheets
│   └── js/               # Client-side JavaScript modules
├── src/                  # Server-side code
│   ├── index.js          # Main application entry point
│   ├── config/           # Configuration files
│   │   └── supabase.js   # Supabase client configuration
│   ├── controllers/      # API controllers
│   │   ├── clientController.js
│   │   ├── productController.js
│   │   ├── transactionController.js
│   │   └── upcController.js        # NEW: UPC lookup controller
│   ├── routes/           # API routes
│   │   ├── clientRoutes.js
│   │   ├── productRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── upcRoutes.js            # NEW: UPC lookup routes
│   └── models/           # Data models (future expansion)
```

## ✨ Features

### 👥 Client Management
- View all clients with filtering and search
- Add new clients with comprehensive contact information
- Edit existing client details
- Delete clients (with referential integrity protection)
- Active/inactive status management

### 📦 Product Management
- View all products with client-based filtering
- Advanced product creation with UPC support
- Real-time inventory level tracking
- Stock status indicators (In Stock, Low Stock, Out of Stock)
- SKU and UPC barcode management
- Client-specific product organization

### 🔄 Inventory Transactions
- **Inbound transactions** (receiving inventory)
- **Outbound transactions** (shipping inventory) 
- Comprehensive transaction history with filtering
- Real-time inventory updates
- Reference number tracking for audit trails
- Transaction notes and documentation

### 📱 **NEW: Advanced Receiving System**
- **Real-time UPC lookup** using external product databases
- **Automatic product creation** with real product names
- **Multi-client receiving sessions** with session management
- **Barcode scanning support** (manual entry or scanner integration)
- **Session-based workflow** with client switching capabilities
- **Live inventory updates** during receiving operations
- **Professional success notifications** and error handling

## 🗄️ Database Schema

The application uses Supabase PostgreSQL with the following optimized tables:

### clients
- `id` (UUID, primary key)
- `name` (varchar) - Client company name
- `code` (varchar, unique) - Client identifier code
- `contact_name` (varchar) - Primary contact person
- `email` (varchar) - Contact email address
- `phone` (varchar) - Contact phone number
- `street_address`, `city`, `state`, `zip_code`, `country` - Address fields
- `active` (boolean) - Client status
- `notes` (text) - Additional client information
- `created_at`, `updated_at` (timestamp) - Audit fields

### products
- `id` (UUID, primary key)
- `name` (varchar) - Product name (auto-populated from UPC lookup)
- `sku` (varchar, unique) - Stock keeping unit
- `upc` (varchar) - Universal product code for barcode scanning
- `client_id` (UUID, foreign key) - References clients table
- `description` (text) - Product description
- `quantity` (integer) - Current inventory level
- `created_at`, `updated_at` (timestamp) - Audit fields

### transactions
- `id` (UUID, primary key)
- `type` (varchar) - 'inbound' or 'outbound'
- `product_id` (UUID, foreign key) - References products table
- `quantity` (integer) - Transaction quantity
- `previous_quantity` (integer) - Inventory level before transaction
- `new_quantity` (integer) - Inventory level after transaction
- `reference` (varchar) - PO numbers, order references, etc.
- `notes` (text) - Transaction details
- `created_by` (varchar) - User identifier
- `created_at` (timestamp) - Transaction timestamp

## 🔌 API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get specific client
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Products
- `GET /api/products` - Get all products
- `GET /api/products?clientId=:clientId` - Get client-specific products
- `GET /api/products/:id` - Get specific product
- `GET /api/products/upc/:upc` - Get product by UPC
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions?type=:type` - Get transactions by type
- `GET /api/transactions/product/:productId` - Get product transaction history
- `POST /api/transactions/inbound` - Create inbound transaction
- `POST /api/transactions/outbound` - Create outbound transaction

### **NEW: UPC Lookup**
- `GET /api/upc/:upc` - Lookup product information by UPC
  - Integrates with UPCitemdb.com API
  - Returns product name, brand, category, and images
  - Fallback handling for unknown UPCs

## ⚙️ Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Supabase account and project

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/UziAkh/3pl-management-system.git
cd 3pl-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
Create a `.env` file with your Supabase credentials:
```env
PORT=3001
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key
```

4. **Database setup**
Run the SQL schema scripts in your Supabase project to create the required tables.

5. **Start the development server**
```bash
npm run dev
```

6. **Access the application**
Open your browser to `http://localhost:3001`

### Production Deployment
```bash
npm start
```

## 🔧 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Vanilla JavaScript** - Client-side functionality
- **Modern CSS3** - Responsive styling with custom design system
- **HTML5** - Semantic markup structure

### External Integrations
- **UPCitemdb.com API** - Product information lookup
- **Real-time barcode scanning** support

## 🚧 Future Enhancements

### Phase 1 - Authentication & Security
- [ ] User authentication and authorization
- [ ] Role-based access control (Admin, Operator, Client)
- [ ] API rate limiting and security headers

### Phase 2 - Advanced Features
- [ ] Enhanced UI with modern framework (React/Vue)
- [ ] Real-time notifications and updates
- [ ] Advanced reporting and analytics dashboard
- [ ] Barcode scanning mobile app integration

### Phase 3 - Warehouse Operations
- [ ] Pick list generation and management
- [ ] Shipping label integration
- [ ] Multi-location warehouse support
- [ ] Cycle counting and inventory audits

### Phase 4 - Business Intelligence
- [ ] KPI dashboards and metrics
- [ ] Automated email notifications
- [ ] Integration with shipping carriers
- [ ] Customer portal access

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, issues, or feature requests:
- Open an issue on GitHub
- Contact: [Your contact information]

## 🏗️ Project Status

**Current Version**: 1.0.0  
**Status**: Active Development  
**Last Updated**: January 2025

---

**Built with ❤️ for the 3PL industry**


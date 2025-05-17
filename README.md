# 3PL Management System

A warehouse inventory management system for third-party logistics (3PL) providers, built with Node.js, Express, and Supabase.

## Current Status

The application currently has a working:
- Express.js backend API
- Supabase database integration
- Frontend interface with client-side JavaScript
- CRUD operations for clients, products, and transactions

## Project Structure
3pl-management-system/
├── .env                  # Environment variables (not in repo)
├── package.json          # Project dependencies
├── public/               # Static files served by Express
│   ├── index.html        # Main frontend interface
│   └── styles.css        # CSS styles (if applicable)
├── src/                  # Server-side code
│   ├── index.js          # Main application entry point
│   ├── config/           # Configuration files
│   │   └── supabase.js   # Supabase client configuration
│   ├── controllers/      # API controllers
│   │   ├── clientController.js
│   │   ├── productController.js
│   │   └── transactionController.js
│   ├── routes/           # API routes
│   │   ├── clientRoutes.js
│   │   ├── productRoutes.js
│   │   └── transactionRoutes.js
│   └── models/           # Data models (future)

## Features

### Client Management
- View all clients
- Add new clients
- Edit existing clients
- Delete clients

### Product Management
- View all products
- Filter products by client
- Add new products
- Edit existing products
- Delete products

### Inventory Transactions
- Record inbound (receive) transactions
- Record outbound (ship) transactions
- View transaction history
- Filter transactions by type

## Database Schema

The application uses Supabase with the following tables:

### clients
- id (UUID, primary key)
- name (varchar)
- code (varchar, unique)
- contact_name (varchar)
- email (varchar)
- phone (varchar)
- street_address (varchar)
- city (varchar)
- state (varchar)
- zip_code (varchar)
- country (varchar)
- active (boolean)
- notes (text)
- created_at (timestamp)
- updated_at (timestamp)

### products
- id (UUID, primary key)
- name (varchar)
- sku (varchar, unique)
- upc (varchar)
- client_id (UUID, foreign key)
- description (text)
- quantity (integer)
- created_at (timestamp)
- updated_at (timestamp)

### transactions
- id (UUID, primary key)
- type (varchar, 'inbound' or 'outbound')
- product_id (UUID, foreign key)
- quantity (integer)
- previous_quantity (integer)
- new_quantity (integer)
- reference (varchar)
- notes (text)
- created_by (varchar)
- created_at (timestamp)

## API Endpoints

### Clients
- GET /api/clients - Get all clients
- GET /api/clients/:id - Get a specific client
- POST /api/clients - Create a new client
- PUT /api/clients/:id - Update a client
- DELETE /api/clients/:id - Delete a client

### Products
- GET /api/products - Get all products
- GET /api/products?clientId=:clientId - Get products for a specific client
- GET /api/products/:id - Get a specific product
- GET /api/products/upc/:upc - Get a product by UPC
- POST /api/products - Create a new product
- PUT /api/products/:id - Update a product
- DELETE /api/products/:id - Delete a product

### Transactions
- GET /api/transactions - Get all transactions
- GET /api/transactions?type=:type - Get transactions of a specific type
- GET /api/transactions/product/:productId - Get transactions for a specific product
- POST /api/transactions/inbound - Create an inbound transaction
- POST /api/transactions/outbound - Create an outbound transaction

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/YourUsername/3pl-management-system.git
cd 3pl-management-system

2. Install dependencies

bashnpm install

3. Create a .env file with your Supabase credentials

PORT=3001
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key

4. Start the development server

bashnpm run dev

5. Access the application at http://localhost:3001

Future Enhancements**

User authentication and authorization
Enhanced UI with modern framework (React, Vue, etc.)
Reporting and analytics
Barcode scanning functionality
Mobile optimization
Email notifications
Enhanced data validation
Comprehensive error handling
Testing suite
Production deployment

# Claude's Project Knowledge

As for Claude's internal project knowledge, Claude should be able to understand the state of your project in future conversations by:

1. Checking your GitHub repository
2. Reading the README.md file
3. Analyzing the code structure and files

When starting a new conversation, you can simply remind Claude that you're working on the 3PL Management System project and point to your GitHub repository, e.g., "I'm continuing work on my 3PL Management System project from GitHub repository: https://github.com/UziAkh/3pl-management-system"

Would you like me to make any changes or additions to the README content before you commit it?



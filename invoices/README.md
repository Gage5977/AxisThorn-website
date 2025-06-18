# Invoice Generator 🧾

A comprehensive, standalone invoice generation system with Stripe-like functionality for creating, managing, and sending professional invoices. Features 21+ payment methods, automatic fee calculations, and professional PDF generation.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.18+-blue.svg)](https://expressjs.com/)

## 🚀 Features Overview

A complete invoicing solution that rivals Stripe's invoice functionality with support for 21 payment methods across 12 countries and 8 currencies.

## ✨ Key Features

### 💳 Payment Methods (21 Supported)
- **Credit/Debit Cards** - Visa, Mastercard, Amex, Discover
- **Digital Wallets** - PayPal, Apple Pay, Google Pay, Venmo
- **Bank Transfers** - ACH, Wire Transfer, SEPA
- **Buy Now Pay Later** - Klarna, Afterpay
- **Cryptocurrency** - Bitcoin, Ethereum
- **Regional Methods** - iDEAL, Giropay, Sofort, Bancontact
- **Traditional** - Cash, Check, Money Order, Zelle

### 🧾 Invoice Management
- Professional invoice creation and editing
- Draft and finalized invoice states
- Automatic invoice numbering
- Line items with quantity and pricing
- Discounts (fixed amount or percentage)
- Tax calculations with customizable rates
- Custom notes and terms & conditions

### 👥 Customer & Product Management
- Complete customer database with addresses
- Product catalog for quick invoice creation
- Customer payment history tracking

### 📊 Advanced Features
- Real-time fee calculations for each payment method
- Multi-currency support (USD, EUR, GBP, CAD, AUD, JPY, BTC, ETH)
- Professional PDF generation
- Email integration for invoice delivery
- Payment tracking and status management
- Dashboard with analytics and statistics
- Search and filtering capabilities

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Gage5977/Invoice-Generator.git
   cd Invoice-Generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env` and update with your settings:
   ```env
   STRIPE_SECRET_KEY=your_stripe_secret_key_here
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
   PORT=3000
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password
   ```

4. **Start the application**
   ```bash
   # Full version (requires npm install)
   npm start
   
   # Demo version (no dependencies required)
   node start-demo.js
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:3000`

## 🎯 Demo & Testing

```bash
# Test core functionality
node test.js

# Test payment methods system
node test-payment-methods.js

# Generate example invoices
node generate-pdf.js
node generate-simple-example.js
```

## API Endpoints

### Invoices
- `POST /api/invoices` - Create new invoice
- `POST /api/invoices/create_preview` - Preview invoice without saving
- `GET /api/invoices` - List all invoices
- `GET /api/invoices/:id` - Get specific invoice
- `POST /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `POST /api/invoices/:id/finalize` - Finalize draft invoice
- `POST /api/invoices/:id/pay` - Mark invoice as paid
- `POST /api/invoices/:id/void` - Void invoice
- `POST /api/invoices/:id/send` - Email invoice to customer
- `GET /api/invoices/:id/download` - Download invoice PDF

### Customers
- `POST /api/customers` - Create customer
- `GET /api/customers` - List all customers
- `GET /api/customers/:id` - Get specific customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Products
- `POST /api/products` - Create product
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## Usage

### Creating an Invoice
1. Click "Create Invoice" in the navigation
2. Select or create a new customer
3. Add line items with descriptions, quantities, and prices
4. Optionally add discounts and tax
5. Add notes or terms if needed
6. Save as draft or create and send immediately

### Managing Invoices
- View all invoices from the dashboard
- Filter by status or search by invoice number/customer
- Click on any invoice to view details
- Download PDFs or resend emails as needed

### Email Configuration
To enable email sending:
1. Use a Gmail account with "Less secure app access" enabled, or
2. Use an app-specific password for Gmail, or
3. Configure your preferred SMTP service in the `.env` file

## Development

The application uses:
- Express.js for the backend API
- In-memory database (can be replaced with MongoDB, PostgreSQL, etc.)
- PDFKit for PDF generation
- Nodemailer for email sending
- Vanilla JavaScript for the frontend

## Extending the Application

To add persistent storage:
1. Install a database driver (e.g., `mongoose` for MongoDB)
2. Replace the in-memory database in `/db/Database.js`
3. Update the model methods to use the database

To integrate with Stripe:
1. Add your Stripe API keys to `.env`
2. The payment attachment endpoints will automatically use Stripe when configured

## 📸 Screenshots

### Dashboard
![Dashboard Overview](docs/dashboard.png)

### Invoice Creation
![Invoice Creation](docs/create-invoice.png)

### Payment Methods
![Payment Methods](docs/payment-methods.png)

## 🌟 Example Output

**Sample Invoice:** [View Example](EXAMPLE_INVOICE.md)

**Generated Files:**
- Text format for email
- HTML format for web viewing
- PDF-ready for printing
- Payment methods with fee calculations

## 🛠 Technical Stack

- **Backend:** Node.js, Express.js
- **Database:** In-memory (easily replaceable with MongoDB/PostgreSQL)
- **PDF Generation:** PDFKit
- **Email:** Nodemailer
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Payment Processing:** Stripe-ready integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Stripe's invoice system
- Built with modern web standards
- Designed for scalability and extensibility

## 📞 Support

For questions and support:
- Create an [Issue](https://github.com/Gage5977/Invoice-Generator/issues)
- Check the [Documentation](PAYMENT_METHODS.md)
- Review [Example Invoices](EXAMPLE_INVOICE.md)

---

**Made with ❤️ for modern businesses**
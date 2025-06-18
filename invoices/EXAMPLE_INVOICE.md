# Example Invoice - Complete Implementation

## 📄 Invoice Overview

**Invoice Number:** INV-202506-5249  
**Status:** DRAFT  
**Total Amount:** $7,036.25  
**Payment Due:** Upon Receipt  

---

## 👤 Customer Information

**Company:** Acme Corporation  
**Email:** billing@acme.com  
**Address:**  
123 Business Avenue  
Suite 100  
Business City, California 90210  

---

## 📋 Line Items

| Description | Qty | Unit Price | Amount |
|-------------|-----|------------|--------|
| Website Development Services | 40 | $125.00 | $5,000.00 |
| SEO Optimization Package | 1 | $800.00 | $800.00 |
| Content Management System Setup | 1 | $1,200.00 | $1,200.00 |

---

## 💰 Financial Breakdown

| Item | Amount |
|------|--------|
| **Subtotal** | $7,000.00 |
| **Discount** | -$500.00 |
| **Tax (8.25%)** | $536.25 |
| **TOTAL** | **$7,036.25** |
| **Amount Due** | **$7,036.25** |

---

## 💳 Payment Methods Accepted

### 1. Credit/Debit Cards (Stripe)
- **Processing Fee:** $204.35 (2.9% + $0.30)
- **Processing Time:** Instant
- **Instructions:** Pay securely online with any major credit or debit card
- **Supported:** Visa, Mastercard, American Express, Discover

### 2. ACH Bank Transfer (Stripe)
- **Processing Fee:** $56.34 (0.8% + $0.05)
- **Processing Time:** 1-3 business days
- **Instructions:** ACH bank transfer - US bank accounts only
- **Best For:** Lower fees, domestic payments

### 3. Wire Transfer (Manual)
- **Processing Fee:** $15.00 (flat fee)
- **Processing Time:** 1-5 business days
- **Instructions:** Contact us for wire transfer instructions
- **Best For:** Large amounts, international payments

### 4. PayPal
- **Processing Fee:** $246.06 (3.49% + $0.49)
- **Processing Time:** Instant
- **Instructions:** Pay with your PayPal account or PayPal Credit
- **Best For:** Familiar interface, buyer protection

### 5. Apple Pay (Stripe)
- **Processing Fee:** $204.35 (2.9% + $0.30)
- **Processing Time:** Instant
- **Instructions:** Use Touch ID or Face ID for secure payment
- **Best For:** iOS users, contactless payment

### 6. Google Pay (Stripe)
- **Processing Fee:** $204.35 (2.9% + $0.30)
- **Processing Time:** Instant
- **Instructions:** Fast, simple payment with Google Pay
- **Best For:** Android users, quick checkout

---

## 🌐 Online Payment

**Pay Online:** https://pay.yourcompany.com/invoice/1750238968687

---

## 📝 Additional Information

### Notes
Thank you for choosing our services. Payment is due within 30 days.

### Terms & Conditions
Net 30 terms. Late payments subject to 1.5% monthly service charge.

---

## 🔧 Technical Implementation

### API Endpoint Example
```javascript
// Create invoice with payment methods
POST /api/invoices
{
  "customerName": "Acme Corporation",
  "customerEmail": "billing@acme.com",
  "items": [
    {
      "description": "Website Development Services",
      "quantity": 40,
      "unitPrice": 125.00
    }
  ],
  "paymentMethods": ["card", "bank_account", "paypal", "apple_pay"],
  "taxRate": 8.25,
  "discount": 500,
  "discountType": "fixed"
}
```

### Payment Method Configuration
```javascript
// Available payment methods automatically filtered by:
// - Customer country
// - Invoice currency
// - Enabled status
// - Fee structure
```

### Fee Calculation Example
```javascript
// For $7,036.25 invoice:
const cardFee = (7036.25 * 0.029) + 0.30; // $204.35
const achFee = (7036.25 * 0.008) + 0.05;  // $56.34
const wireFee = 15.00;                     // $15.00 flat
```

---

## 📊 Payment Method Comparison

| Method | Fee | Total Cost | Processing | Best For |
|--------|-----|------------|------------|----------|
| Wire Transfer | $15.00 | $7,051.25 | 1-5 days | Lowest fee |
| ACH Transfer | $56.34 | $7,092.59 | 1-3 days | Good balance |
| Credit Card | $204.35 | $7,240.60 | Instant | Convenience |
| Apple Pay | $204.35 | $7,240.60 | Instant | iOS users |
| Google Pay | $204.35 | $7,240.60 | Instant | Android users |
| PayPal | $246.06 | $7,282.31 | Instant | Trust & protection |

---

## 🎯 Key Features Demonstrated

✅ **Professional Layout:** Clean, business-ready design  
✅ **Comprehensive Payment Options:** 6 major payment methods  
✅ **Automatic Calculations:** Tax, discount, and fee computation  
✅ **Multiple Formats:** Text, HTML, PDF-ready  
✅ **Fee Transparency:** Clear cost breakdown for each method  
✅ **Processing Times:** Realistic timeframes for each option  
✅ **Instructions:** Clear payment guidance for customers  
✅ **Online Payment Link:** Direct payment portal integration  
✅ **Professional Terms:** Standard business invoice language  
✅ **Customer Information:** Complete billing details  

---

## 📱 Mobile-Friendly Features

- Responsive HTML design
- Touch-friendly payment buttons
- Mobile wallet integration (Apple Pay, Google Pay)
- QR code ready (can be added to payment URL)

---

## 🔒 Security Features

- Stripe-level security for card processing
- Encrypted payment links
- PCI compliance ready
- Fraud protection enabled
- Secure API endpoints

---

## 🌍 Global Support

**Countries Supported:** US, CA, GB, AU, EU, DE, NL, BE, AT, ES, IT, JP  
**Currencies Supported:** USD, EUR, GBP, CAD, AUD, JPY, BTC, ETH  
**Languages:** Ready for internationalization  

This example invoice demonstrates a complete, production-ready invoicing system with comprehensive payment method support that rivals Stripe's invoice functionality.
# Payment Methods Documentation

## Overview
The Invoice Generator supports **21 different payment methods** across **12 countries** and **8 currencies**, providing comprehensive payment options similar to Stripe's offerings.

## Supported Payment Methods

### 💳 Credit & Debit Cards
- **Provider**: Stripe
- **Fee**: 2.9% + $0.30
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP, CAD, AUD
- **Countries**: US, CA, GB, AU, EU

### 🏦 Bank Transfers
#### ACH Bank Transfer
- **Provider**: Stripe
- **Fee**: 0.8% + $0.05
- **Processing**: 1-3 business days
- **Currencies**: USD
- **Countries**: US

#### Wire Transfer
- **Provider**: Manual
- **Fee**: 0% + $15.00
- **Processing**: 1-5 business days
- **Currencies**: USD, EUR, GBP, CAD, AUD, JPY
- **Countries**: US, CA, GB, AU, EU, JP

#### SEPA Direct Debit
- **Provider**: Stripe
- **Fee**: 0.8% + $0.05
- **Processing**: 2-5 business days
- **Currencies**: EUR
- **Countries**: EU

### 📱 Digital Wallets
#### PayPal
- **Provider**: PayPal
- **Fee**: 3.49% + $0.49
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP, CAD, AUD
- **Countries**: US, CA, GB, AU, EU

#### Apple Pay
- **Provider**: Stripe
- **Fee**: 2.9% + $0.30
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP, CAD, AUD
- **Countries**: US, CA, GB, AU, EU

#### Google Pay
- **Provider**: Stripe
- **Fee**: 2.9% + $0.30
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP, CAD, AUD
- **Countries**: US, CA, GB, AU, EU

#### Venmo
- **Provider**: PayPal
- **Fee**: 1.9% + $0.10
- **Processing**: Instant
- **Currencies**: USD
- **Countries**: US

#### Cash App
- **Provider**: Square
- **Fee**: 2.75% + $0.00
- **Processing**: Instant
- **Currencies**: USD
- **Countries**: US

#### Zelle
- **Provider**: Zelle
- **Fee**: 0% + $0.00
- **Processing**: Instant
- **Currencies**: USD
- **Countries**: US

### 🛒 Buy Now, Pay Later
#### Klarna
- **Provider**: Klarna
- **Fee**: 3.29% + $0.30
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP
- **Countries**: US, GB, EU

#### Afterpay
- **Provider**: Afterpay
- **Fee**: 4.0% + $0.30
- **Processing**: Instant
- **Currencies**: USD, AUD
- **Countries**: US, AU

### 🪙 Cryptocurrency
#### Bitcoin
- **Provider**: Coinbase
- **Fee**: 1.0% + $0.00
- **Processing**: 10-60 minutes
- **Currencies**: BTC
- **Countries**: US, CA, GB, AU, EU

#### Ethereum
- **Provider**: Coinbase
- **Fee**: 1.0% + $0.00
- **Processing**: 1-5 minutes
- **Currencies**: ETH
- **Countries**: US, CA, GB, AU, EU

### 🌍 Regional Payment Methods
#### iDEAL (Netherlands)
- **Provider**: Stripe
- **Fee**: 0.8% + $0.29
- **Processing**: Instant
- **Currencies**: EUR
- **Countries**: NL

#### Giropay (Germany)
- **Provider**: Stripe
- **Fee**: 1.4% + $0.29
- **Processing**: Instant
- **Currencies**: EUR
- **Countries**: DE

#### Sofort (Europe)
- **Provider**: Stripe
- **Fee**: 1.4% + $0.29
- **Processing**: Instant
- **Currencies**: EUR
- **Countries**: DE, AT, BE, ES, IT, NL

#### Bancontact (Belgium)
- **Provider**: Stripe
- **Fee**: 1.4% + $0.29
- **Processing**: Instant
- **Currencies**: EUR
- **Countries**: BE

### 💰 Traditional Methods
#### Check/Cheque
- **Provider**: Manual
- **Fee**: 0% + $1.00
- **Processing**: 3-7 business days
- **Currencies**: USD, CAD, GBP
- **Countries**: US, CA, GB

#### Cash Payment
- **Provider**: Manual
- **Fee**: 0% + $0.00
- **Processing**: Instant
- **Currencies**: USD, EUR, GBP, CAD, AUD
- **Countries**: US, CA, GB, AU, EU

#### Money Order
- **Provider**: Manual
- **Fee**: 0% + $0.50
- **Processing**: 3-7 business days
- **Currencies**: USD, CAD
- **Countries**: US, CA

## Fee Comparison (for $1,000 invoice)

| Payment Method | Fee | Total | Percentage |
|----------------|-----|-------|------------|
| Cash Payment | $0.00 | $1,000.00 | 0.00% |
| Zelle | $0.00 | $1,000.00 | 0.00% |
| Money Order | $0.50 | $1,000.50 | 0.05% |
| Check/Cheque | $1.00 | $1,001.00 | 0.10% |
| ACH Bank Transfer | $8.05 | $1,008.05 | 0.80% |
| SEPA Direct Debit | $8.05 | $1,008.05 | 0.80% |
| iDEAL | $8.29 | $1,008.29 | 0.83% |
| Bitcoin | $10.00 | $1,010.00 | 1.00% |
| Ethereum | $10.00 | $1,010.00 | 1.00% |
| Giropay | $14.29 | $1,014.29 | 1.43% |
| Sofort | $14.29 | $1,014.29 | 1.43% |
| Bancontact | $14.29 | $1,014.29 | 1.43% |
| Wire Transfer | $15.00 | $1,015.00 | 1.50% |
| Venmo | $19.10 | $1,019.10 | 1.91% |
| Cash App | $27.50 | $1,027.50 | 2.75% |
| Credit Cards | $29.30 | $1,029.30 | 2.93% |
| Apple Pay | $29.30 | $1,029.30 | 2.93% |
| Google Pay | $29.30 | $1,029.30 | 2.93% |
| Klarna | $33.20 | $1,033.20 | 3.32% |
| PayPal | $35.39 | $1,035.39 | 3.54% |
| Afterpay | $40.30 | $1,040.30 | 4.03% |

## Processing Times

### Instant (14 methods)
- Credit/Debit Cards, PayPal, Apple Pay, Google Pay
- Klarna, Afterpay, iDEAL, Giropay, Sofort, Bancontact
- Cash Payment, Zelle, Venmo, Cash App

### 1-3 Business Days (1 method)
- ACH Bank Transfer

### 1-5 Business Days (1 method)
- Wire Transfer

### Other Processing Times
- Bitcoin: 10-60 minutes
- Ethereum: 1-5 minutes
- SEPA Direct Debit: 2-5 business days
- Check/Cheque: 3-7 business days
- Money Order: 3-7 business days

## API Endpoints

### Get Payment Methods
```
GET /api/payment-methods
GET /api/payment-methods?country=US&currency=usd&enabled=true
```

### Calculate Fees
```
POST /api/payment-methods/:id/calculate-fee
Body: { "amount": 1000 }
```

### Enable/Disable Methods
```
POST /api/payment-methods/:id/toggle
```

### Get by Type
```
GET /api/payment-methods/type/card
GET /api/payment-methods/type/cryptocurrency
```

### Get Metadata
```
GET /api/payment-methods/meta/countries
GET /api/payment-methods/meta/currencies
```

## Integration Features

### Invoice Integration
- Payment methods can be specified per invoice
- Custom payment instructions per method
- Payment URLs for online processing
- Fee calculations included in invoice

### Regional Support
- Automatic filtering by country/currency
- Localized payment method names
- Regional compliance features

### Provider Support
- Stripe integration ready
- PayPal API support
- Manual payment processing
- Cryptocurrency wallet integration

## Recommendations

### For Low Fees
1. Cash Payment (0%)
2. Zelle (0%)
3. Money Order (0.05%)

### For Speed
1. Any instant method (14 available)
2. Cryptocurrency (1-60 minutes)
3. ACH/SEPA (1-5 days)

### For Global Coverage
1. Wire Transfer (6 countries)
2. Credit Cards (5 countries)
3. PayPal (5 countries)

### For Customer Convenience
1. Credit/Debit Cards
2. Apple Pay / Google Pay
3. PayPal
4. Buy Now, Pay Later options
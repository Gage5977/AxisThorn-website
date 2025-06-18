const PaymentMethod = require('../models/PaymentMethod');

// Default payment methods configuration
const defaultPaymentMethods = [
  // Credit/Debit Cards
  new PaymentMethod({
    type: 'card',
    provider: 'stripe',
    name: 'Credit/Debit Cards',
    description: 'Visa, Mastercard, American Express, Discover, and more',
    fees: { percentage: 2.9, fixed: 30 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // ACH/Bank Transfer
  new PaymentMethod({
    type: 'bank_account',
    provider: 'stripe',
    name: 'ACH Bank Transfer',
    description: 'Direct bank account transfer (US only)',
    fees: { percentage: 0.8, fixed: 5 },
    processingTime: '1-3 business days',
    currencies: ['usd'],
    countries: ['US']
  }),

  // Wire Transfer
  new PaymentMethod({
    type: 'wire_transfer',
    provider: 'manual',
    name: 'Wire Transfer',
    description: 'International and domestic wire transfers',
    fees: { percentage: 0, fixed: 1500 }, // $15 flat fee
    processingTime: '1-5 business days',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU', 'JP']
  }),

  // PayPal
  new PaymentMethod({
    type: 'paypal',
    provider: 'paypal',
    name: 'PayPal',
    description: 'Pay with your PayPal account or PayPal Credit',
    fees: { percentage: 3.49, fixed: 49 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // Apple Pay
  new PaymentMethod({
    type: 'apple_pay',
    provider: 'stripe',
    name: 'Apple Pay',
    description: 'Pay securely with Touch ID or Face ID',
    fees: { percentage: 2.9, fixed: 30 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // Google Pay
  new PaymentMethod({
    type: 'google_pay',
    provider: 'stripe',
    name: 'Google Pay',
    description: 'Fast, simple way to pay with Google',
    fees: { percentage: 2.9, fixed: 30 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // Buy Now, Pay Later - Klarna
  new PaymentMethod({
    type: 'buy_now_pay_later',
    provider: 'klarna',
    name: 'Klarna',
    description: 'Pay in 4 interest-free payments',
    fees: { percentage: 3.29, fixed: 30 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp'],
    countries: ['US', 'GB', 'EU']
  }),

  // Buy Now, Pay Later - Afterpay
  new PaymentMethod({
    type: 'buy_now_pay_later',
    provider: 'afterpay',
    name: 'Afterpay',
    description: 'Pay in 4 fortnightly payments',
    fees: { percentage: 4.0, fixed: 30 },
    processingTime: 'instant',
    currencies: ['usd', 'aud'],
    countries: ['US', 'AU']
  }),

  // Cryptocurrency - Bitcoin
  new PaymentMethod({
    type: 'cryptocurrency',
    provider: 'coinbase',
    name: 'Bitcoin',
    description: 'Pay with Bitcoin (BTC)',
    fees: { percentage: 1.0, fixed: 0 },
    processingTime: '10-60 minutes',
    currencies: ['btc'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // Cryptocurrency - Ethereum
  new PaymentMethod({
    type: 'cryptocurrency',
    provider: 'coinbase',
    name: 'Ethereum',
    description: 'Pay with Ethereum (ETH)',
    fees: { percentage: 1.0, fixed: 0 },
    processingTime: '1-5 minutes',
    currencies: ['eth'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // SEPA Direct Debit (Europe)
  new PaymentMethod({
    type: 'sepa_debit',
    provider: 'stripe',
    name: 'SEPA Direct Debit',
    description: 'European bank account debit',
    fees: { percentage: 0.8, fixed: 5 },
    processingTime: '2-5 business days',
    currencies: ['eur'],
    countries: ['EU']
  }),

  // iDEAL (Netherlands)
  new PaymentMethod({
    type: 'ideal',
    provider: 'stripe',
    name: 'iDEAL',
    description: 'Dutch online banking method',
    fees: { percentage: 0.8, fixed: 29 },
    processingTime: 'instant',
    currencies: ['eur'],
    countries: ['NL']
  }),

  // Giropay (Germany)
  new PaymentMethod({
    type: 'giropay',
    provider: 'stripe',
    name: 'Giropay',
    description: 'German online banking method',
    fees: { percentage: 1.4, fixed: 29 },
    processingTime: 'instant',
    currencies: ['eur'],
    countries: ['DE']
  }),

  // Sofort (Europe)
  new PaymentMethod({
    type: 'sofort',
    provider: 'stripe',
    name: 'Sofort',
    description: 'European instant bank transfer',
    fees: { percentage: 1.4, fixed: 29 },
    processingTime: 'instant',
    currencies: ['eur'],
    countries: ['DE', 'AT', 'BE', 'ES', 'IT', 'NL']
  }),

  // Bancontact (Belgium)
  new PaymentMethod({
    type: 'bancontact',
    provider: 'stripe',
    name: 'Bancontact',
    description: 'Belgian payment method',
    fees: { percentage: 1.4, fixed: 29 },
    processingTime: 'instant',
    currencies: ['eur'],
    countries: ['BE']
  }),

  // Check/Cheque
  new PaymentMethod({
    type: 'check',
    provider: 'manual',
    name: 'Check/Cheque',
    description: 'Payment by physical or electronic check',
    fees: { percentage: 0, fixed: 100 }, // $1 processing fee
    processingTime: '3-7 business days',
    currencies: ['usd', 'cad', 'gbp'],
    countries: ['US', 'CA', 'GB']
  }),

  // Cash
  new PaymentMethod({
    type: 'cash',
    provider: 'manual',
    name: 'Cash Payment',
    description: 'In-person cash payment',
    fees: { percentage: 0, fixed: 0 },
    processingTime: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU']
  }),

  // Money Order
  new PaymentMethod({
    type: 'money_order',
    provider: 'manual',
    name: 'Money Order',
    description: 'Payment by money order',
    fees: { percentage: 0, fixed: 50 }, // $0.50 processing fee
    processingTime: '3-7 business days',
    currencies: ['usd', 'cad'],
    countries: ['US', 'CA']
  }),

  // Zelle (US)
  new PaymentMethod({
    type: 'zelle',
    provider: 'zelle',
    name: 'Zelle',
    description: 'Send money with Zelle',
    fees: { percentage: 0, fixed: 0 },
    processingTime: 'instant',
    currencies: ['usd'],
    countries: ['US']
  }),

  // Venmo
  new PaymentMethod({
    type: 'venmo',
    provider: 'paypal',
    name: 'Venmo',
    description: 'Pay with Venmo',
    fees: { percentage: 1.9, fixed: 10 },
    processingTime: 'instant',
    currencies: ['usd'],
    countries: ['US']
  }),

  // Square Cash App
  new PaymentMethod({
    type: 'cash_app',
    provider: 'square',
    name: 'Cash App',
    description: 'Pay with Cash App',
    fees: { percentage: 2.75, fixed: 0 },
    processingTime: 'instant',
    currencies: ['usd'],
    countries: ['US']
  })
];

module.exports = {
  defaultPaymentMethods,
  PaymentMethod
};
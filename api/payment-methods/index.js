// Vercel serverless function for payment methods
const paymentMethods = [
  {
    id: 'card',
    name: 'Credit/Debit Cards',
    type: 'card',
    provider: 'stripe',
    fee_percentage: 2.9,
    fee_fixed: 0.30,
    processing_time: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU'],
    enabled: true
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    provider: 'paypal',
    fee_percentage: 3.49,
    fee_fixed: 0.49,
    processing_time: 'instant',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU'],
    enabled: true
  },
  {
    id: 'bank_account',
    name: 'ACH Bank Transfer',
    type: 'bank_account',
    provider: 'stripe',
    fee_percentage: 0.8,
    fee_fixed: 0.05,
    processing_time: '1-3 business days',
    currencies: ['usd'],
    countries: ['US'],
    enabled: true
  },
  {
    id: 'wire_transfer',
    name: 'Wire Transfer',
    type: 'wire_transfer',
    provider: 'manual',
    fee_percentage: 0,
    fee_fixed: 15.00,
    processing_time: '1-5 business days',
    currencies: ['usd', 'eur', 'gbp', 'cad', 'aud', 'jpy'],
    countries: ['US', 'CA', 'GB', 'AU', 'EU', 'JP'],
    enabled: true
  }
];

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        const { country, currency, enabled } = req.query;
        let filteredMethods = [...paymentMethods];

        if (country) {
          filteredMethods = filteredMethods.filter(method => 
            method.countries.includes(country.toUpperCase())
          );
        }

        if (currency) {
          filteredMethods = filteredMethods.filter(method =>
            method.currencies.includes(currency.toLowerCase())
          );
        }

        if (enabled !== undefined) {
          filteredMethods = filteredMethods.filter(method =>
            method.enabled === (enabled === 'true')
          );
        }

        return res.status(200).json(filteredMethods);

      default:
        res.setHeader('Allow', ['GET', 'OPTIONS']);
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Payment Methods API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
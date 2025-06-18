# Invoice Generator Website Integration Guide

## Overview
Integration plan for embedding invoice generator into Axis Thorn LLC website with unified branding and navigation.

## Current Architecture

### Main Website (Axis Thorn LLC)
- **Location**: `/Documents/Axis-Thorn-LLC-Website/`
- **Style**: Dark theme, professional corporate design
- **Navigation**: Services, About, Contact
- **Brand**: Sophisticated, AI-focused messaging

### Invoice Generator
- **Location**: `/Documents/Invoice-Generator/`
- **Port**: 3000
- **API Endpoints**: Complete REST API for invoices, customers, products
- **Features**: 21 payment methods, PDF generation, email integration

## Integration Strategy: Embedded Client Portal (Recommended)

### Phase 1: Style Integration
1. **Create Branded Invoice Interface**
   - Apply Axis Thorn dark theme
   - Match typography (Inter/Playfair Display fonts)
   - Implement consistent color scheme
   - Add sophisticated animations

2. **Navigation Integration**
   - Add "Client Portal" to main website navigation
   - Create seamless transition between main site and invoice generator
   - Maintain consistent header/footer

### Phase 2: Deployment Options

#### Option A: Subdomain (Recommended)
```
Main Site: https://axisthorn.com
Invoice Portal: https://invoices.axisthorn.com
```

#### Option B: Path-based
```
Main Site: https://axisthorn.com
Invoice Portal: https://axisthorn.com/invoices
```

#### Option C: Embedded iframe
```
Client Portal section on main website
Invoice generator embedded as secure iframe
```

### Phase 3: Technical Implementation

#### File Structure
```
Documents/
├── Axis-Thorn-LLC-Website/          # Main corporate site
├── Invoice-Generator/               # Invoice application
└── Invoice-Integration/             # Integration files
    ├── branded-invoice/             # Styled invoice generator
    ├── shared-assets/              # Common CSS/JS
    └── deployment-config/          # Server configurations
```

#### API Integration Points
- `/api/invoices` - Invoice CRUD operations
- `/api/customers` - Customer management  
- `/api/products` - Product catalog
- `/api/payment-methods` - Payment processing
- `/api/checkout` - Payment workflows

## Implementation Steps

### Step 1: Create Branded Interface
```bash
# Copy invoice generator to new branded version
cp -r Invoice-Generator Invoice-Integration/branded-invoice

# Modify styles to match Axis Thorn branding
# Update colors, fonts, layout to match main website
```

### Step 2: Update Main Website Navigation
```html
<!-- Add to main website navigation -->
<li><a href="#services" class="nav-link">Services</a></li>
<li><a href="#about" class="nav-link">About</a></li>
<li><a href="/invoices" class="nav-link">Client Portal</a></li>
<li><a href="#contact" class="nav-link">Contact</a></li>
```

### Step 3: Configure Subdomain Deployment
- Set up DNS: invoices.axisthorn.com
- Configure reverse proxy/load balancer
- SSL certificate for subdomain
- Cross-origin authentication setup

### Step 4: Shared Authentication
```javascript
// Implement shared session management
// JWT tokens for cross-domain authentication
// User role management (admin/client)
```

## Branding Guidelines

### Colors (from main website)
- Primary: Dark backgrounds with gold/amber accents
- Text: Light colors on dark backgrounds
- Interactive elements: Gradient effects and subtle animations

### Typography
- Headers: Playfair Display (serif, elegant)
- Body: Inter (sans-serif, clean)
- Technical: Monospace for invoice numbers/data

### Visual Elements
- Geometric patterns and neural network aesthetics
- Subtle animations and hover effects  
- Professional card-based layouts
- Sophisticated form styling

## Security Considerations

### Authentication
- Secure client login system
- Role-based access (admin vs client views)
- Session management across domains

### Data Protection
- Client invoice data segregation
- Secure payment processing
- Audit trails for financial transactions

### HTTPS/SSL
- Full SSL encryption
- Secure cookie handling
- CSRF protection

## Deployment Configuration

### Server Setup
```nginx
# Nginx configuration for subdomain
server {
    listen 443 ssl;
    server_name invoices.axisthorn.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Environment Variables
```env
# Production configuration
NODE_ENV=production
PORT=3000
DOMAIN=invoices.axisthorn.com
CORS_ORIGIN=https://axisthorn.com,https://invoices.axisthorn.com

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=invoices@axisthorn.com

# Payment processing
STRIPE_SECRET_KEY=your_key_here
```

## Testing Strategy

### Integration Testing
1. Navigation flow between main site and invoice portal
2. Cross-domain authentication
3. Brand consistency verification
4. Mobile responsiveness

### User Acceptance Testing
1. Client workflow: Login → Create Invoice → Send → Track Payment
2. Admin workflow: Customer management, reporting, settings
3. Payment processing with multiple methods
4. PDF generation and email delivery

## Go-Live Checklist

- [ ] Branded interface matches main website design
- [ ] Navigation integration complete
- [ ] Subdomain configured and SSL enabled
- [ ] Authentication system implemented
- [ ] Payment methods configured and tested
- [ ] Email delivery functional
- [ ] PDF generation working
- [ ] Mobile responsiveness verified
- [ ] Security audit completed
- [ ] Backup and monitoring systems active

## Maintenance

### Regular Updates
- Security patches for Node.js dependencies
- SSL certificate renewal
- Payment method configurations
- Brand consistency reviews

### Monitoring
- Application performance metrics
- Payment processing success rates
- User engagement analytics
- Error tracking and alerting

## Support Resources

### Documentation
- Invoice Generator API docs
- Payment method configuration guides
- Troubleshooting common issues

### Technical Contacts
- DNS/Domain management
- SSL certificate providers
- Payment processor support
- Email delivery service support
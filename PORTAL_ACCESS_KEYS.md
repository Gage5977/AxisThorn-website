# Portal Access Keys

## AXIS Terminal (/app or /terminal)
Access codes for the professional financial analysis platform:
- `AXIS2025TERMINAL`
- `THORNINTEL2025`
- `AUTONOMY2025`

## Client Portal (/invoices)
No access key required - uses email-based authentication

## Banking Portal (/banking-portal)
No access key required - publicly accessible for banking instructions and 1099 forms

## Axis AI (/axis-ai)
No access key required - open preview access

## Redirects Configuration
The following redirects are active:

### Invoice/Payment Redirects
- `/client-portal` → `/invoices`
- `/portal` → `/invoices`
- `/invoice` → `/invoices`
- `/pay` → `/invoices`
- `/payment` → `/invoices`

### 1099 Form Redirects
- `/1099` → `/banking-portal#1099`
- `/1099.html` → `/banking-portal.html`

### Service Redirects
- `/consult` → `/consultation`
- `/implement` → `/implementation`

### System Redirects
- `/axis-terminal` → `/terminal`
- `/ai` → `/axis-ai`
- `/banking.html` → `/banking-portal`

## Implementation Notes
- Access control is implemented client-side for demonstration
- Production deployment should use server-side authentication
- Access codes are stored in sessionStorage for session persistence
- Terminal access redirects to /terminal.html after successful authentication
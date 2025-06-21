# API Versioning Guide

## Overview

The Axis Thorn API now supports versioning to ensure backward compatibility while allowing for future improvements. All API endpoints are now versioned under `/api/v1/`.

## Current Version

- **Current Stable Version**: v1
- **Status**: Stable
- **Base URL**: `https://axisthorn.com/api/v1/`

## Endpoint Structure

All API endpoints now follow this structure:
```
/api/{version}/{endpoint}
```

### Available Endpoints

- `/api/v1/invoices` - Invoice management
- `/api/v1/customers` - Customer management
- `/api/v1/products` - Product management
- `/api/v1/stripe-payment` - Stripe payment processing
- `/api/v1/payment-methods` - Payment method management
- `/api/v1/ai-chat` - AI chat functionality
- `/api/v1/ai-demo` - AI demo endpoints

## Version Selection

You can specify the API version in three ways:

### 1. URL Path (Recommended)
```
GET /api/v1/invoices
```

### 2. Accept-Version Header
```
GET /api/invoices
Accept-Version: v1
```

### 3. X-API-Version Header
```
GET /api/invoices
X-API-Version: v1
```

If no version is specified, the API will default to the latest stable version (currently v1).

## Migration Guide

### From Non-Versioned to v1

If you're currently using the non-versioned API endpoints, update your API calls:

**Old Format:**
```javascript
fetch('/api/invoices')
```

**New Format:**
```javascript
fetch('/api/v1/invoices')
```

### Client Library Updates

Update your API base URL configuration:

```javascript
// Old configuration
const API_BASE = '/api';

// New configuration
const API_BASE = '/api/v1';
```

## Version Deprecation Policy

1. **Deprecation Notice**: Deprecated versions will include warning headers
2. **Sunset Period**: Minimum 6 months notice before version sunset
3. **Migration Support**: Documentation and tools provided for migration

## Response Headers

All API responses include version information:

```
X-API-Version: v1
X-API-Deprecation-Warning: (if applicable)
X-API-Sunset-Date: (if applicable)
```

## Best Practices

1. **Always specify version explicitly** in production applications
2. **Monitor deprecation warnings** in response headers
3. **Test against new versions** before they become default
4. **Subscribe to API updates** for version announcements

## Version Aliases

For convenience, the following aliases are available:

- `latest` - Points to the latest stable version
- `stable` - Points to the current stable version

**Note**: While aliases are convenient for development, always use explicit version numbers in production.

## Error Handling

Invalid version requests will return:

```json
{
  "error": "Invalid API version",
  "requestedVersion": "v99",
  "supportedVersions": ["v1"],
  "defaultVersion": "v1"
}
```

## Future Versions

When new versions are released:

1. Existing version endpoints remain unchanged
2. New features are added to the new version
3. Breaking changes are isolated to new versions
4. Clear migration guides are provided

## Questions?

For API version support, please contact: support@axisthorn.com
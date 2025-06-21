# 🧪 Axis Thorn Local Test Environment

This local test environment allows you to review all the implemented security and infrastructure improvements before deploying to production.

## 🚀 Quick Start

```bash
# Start the local test server
./start-local-test.sh

# Or manually:
node local-test-server.js
```

## 🌐 Test URLs

Once the server is running, visit these URLs:

### Main Application
- **Homepage**: http://localhost:3000
- **Terminal**: http://localhost:3000/terminal
- **AXIS AI**: http://localhost:3000/axis-ai
- **Invoices**: http://localhost:3000/invoices
- **Banking Portal**: http://localhost:3000/banking-portal

### Test Endpoints
- **Server Status**: http://localhost:3000/test
- **API Version**: http://localhost:3000/api/v1
- **Invoice API**: http://localhost:3000/api/v1/invoices

### Interactive Test Client
- Open `test-client.html` in your browser for a comprehensive testing interface

## ✅ Features to Test

### 1. **Security Enhancements**
- **CORS Protection**: Requests from unauthorized domains are blocked
- **Input Validation**: Try submitting invalid data to see Joi validation in action
- **Security Headers**: Check Network tab for Helmet security headers
- **Rate Limiting**: Multiple rapid requests will be limited

### 2. **API Versioning**
- **Version 1 API**: All endpoints now use `/api/v1/` prefix
- **Version Information**: Visit `/api/v1` to see available endpoints
- **Backward Compatibility**: Old endpoints redirect to versioned ones

### 3. **Navigation Consistency**
- **Shared Navigation**: All pages use the same navigation component
- **Context-Aware Menus**: Navigation adapts based on current page
- **Mobile Support**: Responsive navigation with hamburger menu

### 4. **Enhanced Invoice API**
- **Full CRUD Operations**: Create, read, update, delete invoices
- **Input Validation**: Comprehensive validation using Joi schemas
- **Pagination & Filtering**: Query parameters for large datasets
- **Error Handling**: Proper error responses with details

### 5. **Code Quality**
- **ESLint Configuration**: Code follows consistent style rules
- **Prettier Formatting**: Automatic code formatting
- **Error Logging**: Winston logger captures all errors

## 🧪 Test Scenarios

### Test 1: Create a Valid Invoice
```bash
curl -X POST http://localhost:3000/api/v1/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "Test Company",
      "email": "test@example.com"
    },
    "items": [{
      "description": "Consulting",
      "quantity": 10,
      "unitPrice": 150
    }],
    "taxRate": 8.5
  }'
```

### Test 2: Try Invalid Data (Should Fail)
```bash
curl -X POST http://localhost:3000/api/v1/invoices \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "",
      "email": "not-an-email"
    },
    "items": []
  }'
```

### Test 3: Check API Version
```bash
curl http://localhost:3000/api/v1
```

### Test 4: Test CORS (Should be blocked from unauthorized domains)
```javascript
// Try this in browser console from different domain:
fetch('http://localhost:3000/api/v1/invoices', {
  method: 'GET',
  mode: 'cors'
})
```

## 🔍 Things to Look For

### ✅ Navigation
1. Visit different pages and verify navigation is consistent
2. Check that current page is highlighted in navigation
3. Test mobile menu (resize browser window)

### ✅ API Security
1. Look for CORS headers in Network tab
2. Try invalid data - should return 400 with validation errors
3. Check for security headers (X-Frame-Options, CSP, etc.)

### ✅ Performance
1. Check response times in Network tab
2. Verify error handling doesn't crash server
3. Test multiple concurrent requests

### ✅ Functionality
1. Create invoices with valid data
2. Retrieve invoice lists
3. Test pagination with query parameters

## 🐛 Known Limitations

- **In-Memory Storage**: Data resets when server restarts
- **No Database**: Using arrays instead of persistent storage
- **Limited Authentication**: Basic structure in place, not fully implemented
- **Local Environment**: Some features may behave differently in production

## 📊 Success Criteria

The test environment demonstrates:

- ✅ **Security**: CORS, validation, headers implemented
- ✅ **API Versioning**: Clean `/api/v1/` structure
- ✅ **Navigation**: Consistent across all pages
- ✅ **Validation**: Proper error responses for invalid data
- ✅ **Code Quality**: ESLint passing, formatted code
- ✅ **Error Handling**: Graceful error responses

## 🚀 Next Steps

After testing locally:

1. **Deploy to Vercel**: Push changes to see them in production
2. **Database Integration**: Replace in-memory storage with PostgreSQL/MongoDB
3. **Authentication**: Implement JWT/OAuth user authentication
4. **Real-time Features**: Add WebSocket support for live updates
5. **Background Jobs**: Implement PDF generation as background tasks

## 🛠 Troubleshooting

### Server Won't Start
- Check if port 3000 is available: `lsof -i :3000`
- Install dependencies: `npm install`
- Check Node.js version: `node --version` (needs 18+)

### API Errors
- Check console logs for detailed error messages
- Verify request format matches Joi schemas
- Ensure Content-Type header is set correctly

### Navigation Issues
- Check browser console for JavaScript errors
- Verify shared-navigation.js is loading
- Clear browser cache if needed
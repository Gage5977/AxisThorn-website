# Pre-Deployment Testing Checklist

## 🚀 How to Start Test Server

```bash
cd /Users/axisthornllc/Documents/Web-Projects/Axis-Thorn-LLC-Website
node test-server.js
```

Then open: http://localhost:5173

## ✅ Critical Features to Test

### 1. Homepage Functionality
- [ ] Page loads without errors
- [ ] Navigation menu works (all links)
- [ ] Contact form submits successfully
- [ ] Responsive design on mobile
- [ ] Hero section animations work
- [ ] Footer links to legal pages work

### 2. Contact Form Testing
- [ ] Form validation works (try submitting empty fields)
- [ ] Email validation works (try invalid email)
- [ ] Success message appears after submission
- [ ] All inquiry types selectable
- [ ] Error handling for network issues

### 3. Legal Pages Compliance
- [ ] Privacy Policy loads and is comprehensive
- [ ] Terms of Service loads with all sections
- [ ] Cookie Policy loads with detailed information
- [ ] All legal pages have consistent design
- [ ] Footer links work from all pages

### 4. Service Pages
- [ ] /services page loads with all service details
- [ ] /consultation page loads with consultation info
- [ ] /implementation page exists and loads
- [ ] /support page exists and loads
- [ ] All service CTAs link correctly

### 5. Error Handling
- [ ] Visit http://localhost:5173/nonexistent-page (should show 404)
- [ ] Disconnect internet and test form (should show network error)
- [ ] Test JavaScript errors (open console)
- [ ] Error notifications appear and disappear correctly

### 6. Navigation & UX
- [ ] All navigation links work correctly
- [ ] Logo links back to homepage
- [ ] Page transitions are smooth
- [ ] Cards have hover effects
- [ ] Mobile menu works (if applicable)

### 7. Performance & Loading
- [ ] All CSS files load correctly
- [ ] All JavaScript files load without errors
- [ ] Images and SVGs display properly
- [ ] Fonts load correctly (Inter font family)
- [ ] No console errors in browser dev tools

## 🔍 Browser Testing

Test in multiple browsers:
- [ ] Chrome/Chromium
- [ ] Safari
- [ ] Firefox
- [ ] Mobile Safari (iPhone)
- [ ] Mobile Chrome (Android)

## 📱 Mobile Responsiveness

Test on different screen sizes:
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x812)

## 🛡️ Security Testing

- [ ] Contact form prevents XSS
- [ ] No sensitive data in console logs
- [ ] Legal pages load over HTTPS (in production)
- [ ] No test credentials visible

## 🚨 Common Issues to Check

1. **Broken Links**: Click every link and button
2. **Form Errors**: Try submitting invalid data
3. **Console Errors**: Check browser developer console
4. **Mobile Issues**: Test touch interactions
5. **Loading Speed**: Pages should load under 3 seconds
6. **Error Messages**: Should be user-friendly, not technical

## ✅ Pre-Deployment Sign-off

Once all items above are tested and working:

- [ ] All critical functionality works
- [ ] No console errors
- [ ] Mobile responsive design confirmed
- [ ] Contact form processing works
- [ ] Legal pages are complete and accessible
- [ ] Error handling is graceful
- [ ] Performance is acceptable

**Tested by**: ________________  
**Date**: ________________  
**Ready for Production**: ☐ Yes ☐ No  

## 🚀 Next Steps After Testing

If all tests pass:
1. Update environment variables for production
2. Deploy to Vercel
3. Test on live domain
4. Update DNS if needed
5. Monitor for 24 hours post-launch
// Administrative Services Module
import { showNotification } from './notification.js';

export const AdminServices = {
    init() {
        this.initTaxIdFormatting();
        this.initBankingRequests();
    },
    
    initTaxIdFormatting() {
        const taxIdInput = document.getElementById('taxId');
        if (!taxIdInput) return;
        
        taxIdInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length <= 9) {
                // SSN format: XXX-XX-XXXX
                if (value.length >= 6) {
                    value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
                } else if (value.length >= 4) {
                    value = value.slice(0, 3) + '-' + value.slice(3);
                }
            } else {
                // EIN format: XX-XXXXXXX
                value = value.slice(0, 2) + '-' + value.slice(2, 9);
            }
            
            e.target.value = value;
        });
    },
    
    initBankingRequests() {
        const secureElements = document.querySelectorAll('.detail-value.secure');
        
        secureElements.forEach(element => {
            element.style.cursor = 'pointer';
            element.title = 'Click to request banking details';
            
            element.addEventListener('click', function() {
                const paymentType = this.getAttribute('data-payment-type');
                const paymentMethod = this.closest('.payment-method').querySelector('h5').textContent;
                AdminServices.requestBankingDetails(paymentMethod, paymentType);
            });
        });
    },
    
    requestBankingDetails(paymentMethod, paymentType) {
        const subject = encodeURIComponent(`Banking Instructions Request - ${paymentMethod}`);
        const body = encodeURIComponent(`Hello,

I am requesting banking instructions for: ${paymentMethod}
Payment Type: ${paymentType || 'Standard'}

Please provide secure banking details for payment processing.

Invoice/Reference Number: [Please specify]
Expected Payment Amount: [Please specify]
Payment Date: [Please specify]

Thank you.`);
        
        const mailtoLink = `mailto:AI.info@axisthorn.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
        
        showNotification('Email client opened. Banking details will be provided via encrypted email within 2 hours.', 'info');
    }
};

export default AdminServices;
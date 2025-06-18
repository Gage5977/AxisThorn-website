const API_URL = 'http://localhost:3000/api';

// State management
let currentInvoice = null;
let customers = [];
let products = [];

// DOM elements
const views = document.querySelectorAll('.view');
const navBtns = document.querySelectorAll('.nav-btn');
const modal = document.getElementById('modal');
const previewModal = document.getElementById('previewModal');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadDashboard();
    setDefaultDates();
});

function initializeEventListeners() {
    // Navigation
    navBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            switchView(view);
        });
    });

    // Invoice form
    document.getElementById('customerSelect').addEventListener('change', handleCustomerSelect);
    document.getElementById('addLineItem').addEventListener('click', addLineItem);
    document.getElementById('saveAsDraft').addEventListener('click', () => saveInvoice('draft'));
    document.getElementById('previewInvoice').addEventListener('click', previewInvoice);
    document.getElementById('invoiceForm').addEventListener('submit', (e) => {
        e.preventDefault();
        saveInvoice('finalize');
    });

    // Calculate totals on change
    ['discount', 'discountType', 'taxRate'].forEach(id => {
        document.getElementById(id).addEventListener('input', calculateTotals);
    });

    // Customer and Product buttons
    document.getElementById('addCustomerBtn').addEventListener('click', showAddCustomerModal);
    document.getElementById('addProductBtn').addEventListener('click', showAddProductModal);

    // Modal close
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            previewModal.style.display = 'none';
        });
    });

    // Search and filter
    document.getElementById('searchInvoices').addEventListener('input', filterInvoices);
    document.getElementById('statusFilter').addEventListener('change', filterInvoices);
}

function switchView(viewName) {
    views.forEach(view => view.classList.remove('active'));
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(viewName).classList.add('active');
    document.querySelector(`[data-view="${viewName}"]`).classList.add('active');
    
    switch(viewName) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'create':
            loadCustomersForSelect();
            break;
        case 'customers':
            loadCustomers();
            break;
        case 'products':
            loadProducts();
            break;
    }
}

async function loadDashboard() {
    try {
        const response = await fetch(`${API_URL}/invoices`);
        const invoices = await response.json();
        
        updateStats(invoices);
        displayInvoices(invoices);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

function updateStats(invoices) {
    const stats = {
        total: invoices.length,
        paid: invoices.filter(inv => inv.status === 'paid').length,
        pending: invoices.filter(inv => inv.status === 'open').length,
        revenue: invoices
            .filter(inv => inv.status === 'paid')
            .reduce((sum, inv) => sum + inv.total, 0)
    };
    
    document.getElementById('totalInvoices').textContent = stats.total;
    document.getElementById('paidInvoices').textContent = stats.paid;
    document.getElementById('pendingInvoices').textContent = stats.pending;
    document.getElementById('totalRevenue').textContent = `$${stats.revenue.toFixed(2)}`;
}

function displayInvoices(invoices) {
    const tbody = document.querySelector('#invoicesTable tbody');
    tbody.innerHTML = '';
    
    invoices.forEach(invoice => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${invoice.number}</td>
            <td>${invoice.customerName}</td>
            <td>${new Date(invoice.invoiceDate).toLocaleDateString()}</td>
            <td>${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</td>
            <td>$${invoice.total.toFixed(2)}</td>
            <td><span class="status ${invoice.status}">${invoice.status.toUpperCase()}</span></td>
            <td>
                <button class="action-btn view" onclick="viewInvoice('${invoice.id}')">View</button>
                ${invoice.status === 'draft' ? `<button class="action-btn edit" onclick="editInvoice('${invoice.id}')">Edit</button>` : ''}
                ${invoice.status === 'open' ? `<button class="action-btn" onclick="sendReminder('${invoice.id}')">Send Reminder</button>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    });
}

function setDefaultDates() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('invoiceDate').value = today;
    
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    document.getElementById('dueDate').value = dueDate.toISOString().split('T')[0];
}

function handleCustomerSelect(e) {
    const value = e.target.value;
    const newCustomerFields = document.getElementById('newCustomerFields');
    
    if (value === 'new') {
        newCustomerFields.style.display = 'block';
    } else {
        newCustomerFields.style.display = 'none';
        if (value) {
            const customer = customers.find(c => c.id === value);
            if (customer) {
                fillCustomerInfo(customer);
            }
        }
    }
}

function fillCustomerInfo(customer) {
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone || '';
    
    if (customer.address) {
        document.getElementById('addressLine1').value = customer.address.line1 || '';
        document.getElementById('addressLine2').value = customer.address.line2 || '';
        document.getElementById('city').value = customer.address.city || '';
        document.getElementById('state').value = customer.address.state || '';
        document.getElementById('postalCode').value = customer.address.postalCode || '';
    }
}

function addLineItem() {
    const lineItemsDiv = document.getElementById('lineItems');
    const newItem = document.createElement('div');
    newItem.className = 'line-item';
    newItem.innerHTML = `
        <input type="text" placeholder="Description" class="item-description">
        <input type="number" placeholder="Qty" class="item-quantity" value="1" min="1">
        <input type="number" placeholder="Unit Price" class="item-price" step="0.01" min="0">
        <span class="item-total">$0.00</span>
        <button type="button" class="remove-item" onclick="removeLineItem(this)">×</button>
    `;
    
    lineItemsDiv.appendChild(newItem);
    
    // Add event listeners
    newItem.querySelector('.item-quantity').addEventListener('input', updateLineItem);
    newItem.querySelector('.item-price').addEventListener('input', updateLineItem);
}

function removeLineItem(button) {
    button.parentElement.remove();
    calculateTotals();
}

function updateLineItem(e) {
    const lineItem = e.target.parentElement;
    const quantity = parseFloat(lineItem.querySelector('.item-quantity').value) || 0;
    const price = parseFloat(lineItem.querySelector('.item-price').value) || 0;
    const total = quantity * price;
    
    lineItem.querySelector('.item-total').textContent = `$${total.toFixed(2)}`;
    calculateTotals();
}

function calculateTotals() {
    let subtotal = 0;
    
    document.querySelectorAll('.line-item').forEach(item => {
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const price = parseFloat(item.querySelector('.item-price').value) || 0;
        subtotal += quantity * price;
    });
    
    const discountValue = parseFloat(document.getElementById('discount').value) || 0;
    const discountType = document.getElementById('discountType').value;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
    
    let discountAmount = 0;
    if (discountType === 'percentage') {
        discountAmount = (subtotal * discountValue) / 100;
    } else {
        discountAmount = discountValue;
    }
    
    const subtotalAfterDiscount = subtotal - discountAmount;
    const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
    const total = subtotalAfterDiscount + taxAmount;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('discountAmount').textContent = `-$${discountAmount.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${taxAmount.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

async function saveInvoice(action) {
    const invoiceData = collectInvoiceData();
    
    if (!validateInvoiceData(invoiceData)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/invoices`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });
        
        const invoice = await response.json();
        
        if (action === 'finalize') {
            await fetch(`${API_URL}/invoices/${invoice.id}/finalize`, { method: 'POST' });
            await fetch(`${API_URL}/invoices/${invoice.id}/send`, { method: 'POST' });
            alert('Invoice created and sent successfully!');
        } else {
            alert('Invoice saved as draft!');
        }
        
        switchView('dashboard');
    } catch (error) {
        console.error('Error saving invoice:', error);
        alert('Error saving invoice');
    }
}

function collectInvoiceData() {
    const items = [];
    document.querySelectorAll('.line-item').forEach(item => {
        const description = item.querySelector('.item-description').value;
        const quantity = parseFloat(item.querySelector('.item-quantity').value) || 0;
        const unitPrice = parseFloat(item.querySelector('.item-price').value) || 0;
        
        if (description && quantity && unitPrice) {
            items.push({ description, quantity, unitPrice });
        }
    });
    
    return {
        customerName: document.getElementById('customerName').value,
        customerEmail: document.getElementById('customerEmail').value,
        customerPhone: document.getElementById('customerPhone').value,
        customerAddress: {
            line1: document.getElementById('addressLine1').value,
            line2: document.getElementById('addressLine2').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            postalCode: document.getElementById('postalCode').value
        },
        invoiceDate: document.getElementById('invoiceDate').value,
        dueDate: document.getElementById('dueDate').value,
        items: items,
        discount: parseFloat(document.getElementById('discount').value) || 0,
        discountType: document.getElementById('discountType').value,
        taxRate: parseFloat(document.getElementById('taxRate').value) || 0,
        notes: document.getElementById('notes').value,
        terms: document.getElementById('terms').value
    };
}

function validateInvoiceData(data) {
    if (!data.customerName || !data.customerEmail) {
        alert('Please provide customer name and email');
        return false;
    }
    
    if (data.items.length === 0) {
        alert('Please add at least one line item');
        return false;
    }
    
    return true;
}

async function previewInvoice() {
    const invoiceData = collectInvoiceData();
    
    if (!validateInvoiceData(invoiceData)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/invoices/create_preview`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(invoiceData)
        });
        
        const preview = await response.json();
        displayPreview(preview);
    } catch (error) {
        console.error('Error creating preview:', error);
    }
}

function displayPreview(invoice) {
    const previewContent = document.getElementById('previewContent');
    previewContent.innerHTML = `
        <div class="invoice-preview">
            <div class="invoice-header">
                <h1>INVOICE</h1>
                <p>Invoice #: ${invoice.number}</p>
                <p>Date: ${new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                <p>Due Date: ${invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'Upon Receipt'}</p>
            </div>
            
            <div class="invoice-details">
                <div>
                    <h3>From:</h3>
                    <p>Your Company Name<br>
                    123 Business St<br>
                    City, State 12345</p>
                </div>
                <div>
                    <h3>Bill To:</h3>
                    <p>${invoice.customerName}<br>
                    ${invoice.customerEmail}<br>
                    ${invoice.customerAddress.line1 || ''}<br>
                    ${invoice.customerAddress.city || ''}, ${invoice.customerAddress.state || ''} ${invoice.customerAddress.postalCode || ''}</p>
                </div>
            </div>
            
            <div class="items-table">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit Price</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoice.items.map(item => `
                            <tr>
                                <td>${item.description}</td>
                                <td>${item.quantity}</td>
                                <td>$${item.unitPrice.toFixed(2)}</td>
                                <td>$${item.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="invoice-totals">
                <div class="totals-row">
                    <span>Subtotal:</span>
                    <span>$${invoice.subtotal.toFixed(2)}</span>
                </div>
                ${invoice.discount > 0 ? `
                    <div class="totals-row">
                        <span>Discount:</span>
                        <span>-$${((invoice.discountType === 'percentage' ? (invoice.subtotal * invoice.discount / 100) : invoice.discount)).toFixed(2)}</span>
                    </div>
                ` : ''}
                ${invoice.taxRate > 0 ? `
                    <div class="totals-row">
                        <span>Tax (${invoice.taxRate}%):</span>
                        <span>$${invoice.tax.toFixed(2)}</span>
                    </div>
                ` : ''}
                <div class="totals-row total">
                    <span>Total:</span>
                    <span>$${invoice.total.toFixed(2)}</span>
                </div>
            </div>
            
            ${invoice.notes ? `<div class="invoice-notes"><h4>Notes:</h4><p>${invoice.notes}</p></div>` : ''}
            ${invoice.terms ? `<div class="invoice-terms"><h4>Terms:</h4><p>${invoice.terms}</p></div>` : ''}
        </div>
    `;
    
    previewModal.style.display = 'block';
    currentInvoice = invoice;
}

async function loadCustomersForSelect() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        customers = await response.json();
        
        const select = document.getElementById('customerSelect');
        select.innerHTML = `
            <option value="">-- Select Customer --</option>
            <option value="new">+ New Customer</option>
            ${customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
        `;
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function loadCustomers() {
    try {
        const response = await fetch(`${API_URL}/customers`);
        const customers = await response.json();
        
        const tbody = document.querySelector('#customersTable tbody');
        tbody.innerHTML = '';
        
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone || '-'}</td>
                <td>
                    <button class="action-btn edit" onclick="editCustomer('${customer.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteCustomer('${customer.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const tbody = document.querySelector('#productsTable tbody');
        tbody.innerHTML = '';
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>$${product.unitPrice.toFixed(2)}</td>
                <td>
                    <button class="action-btn edit" onclick="editProduct('${product.id}')">Edit</button>
                    <button class="action-btn delete" onclick="deleteProduct('${product.id}')">Delete</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function showAddCustomerModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add Customer</h2>
        <form id="customerForm">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="modalCustomerName" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="modalCustomerEmail" required>
            </div>
            <div class="form-group">
                <label>Phone</label>
                <input type="tel" id="modalCustomerPhone">
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Save Customer</button>
            </div>
        </form>
    `;
    
    document.getElementById('customerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const customerData = {
            name: document.getElementById('modalCustomerName').value,
            email: document.getElementById('modalCustomerEmail').value,
            phone: document.getElementById('modalCustomerPhone').value
        };
        
        try {
            await fetch(`${API_URL}/customers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customerData)
            });
            
            modal.style.display = 'none';
            loadCustomers();
        } catch (error) {
            console.error('Error adding customer:', error);
        }
    });
    
    modal.style.display = 'block';
}

function showAddProductModal() {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Add Product</h2>
        <form id="productForm">
            <div class="form-group">
                <label>Name</label>
                <input type="text" id="modalProductName" required>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea id="modalProductDescription" rows="3"></textarea>
            </div>
            <div class="form-group">
                <label>Unit Price</label>
                <input type="number" id="modalProductPrice" step="0.01" min="0" required>
            </div>
            <div class="form-actions">
                <button type="submit" class="btn-primary">Save Product</button>
            </div>
        </form>
    `;
    
    document.getElementById('productForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const productData = {
            name: document.getElementById('modalProductName').value,
            description: document.getElementById('modalProductDescription').value,
            unitPrice: parseFloat(document.getElementById('modalProductPrice').value)
        };
        
        try {
            await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            modal.style.display = 'none';
            loadProducts();
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });
    
    modal.style.display = 'block';
}

async function viewInvoice(id) {
    try {
        const response = await fetch(`${API_URL}/invoices/${id}`);
        const invoice = await response.json();
        displayPreview(invoice);
        
        // Update modal actions based on invoice status
        document.getElementById('downloadPDF').onclick = () => downloadInvoicePDF(id);
        document.getElementById('createCheckout').onclick = () => createCheckoutSession(id);
        document.getElementById('sendInvoice').onclick = () => sendInvoiceEmail(id);
        
        if (invoice.status !== 'draft') {
            document.getElementById('sendInvoice').textContent = 'Resend Invoice';
        }
    } catch (error) {
        console.error('Error viewing invoice:', error);
    }
}

async function downloadInvoicePDF(id) {
    window.open(`${API_URL}/invoices/${id}/download`, '_blank');
}

async function createCheckoutSession(id) {
    try {
        const response = await fetch(`${API_URL}/checkout/sessions/from-invoice/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success_url: `${window.location.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${window.location.origin}/cancel.html?session_id={CHECKOUT_SESSION_ID}`
            })
        });

        const session = await response.json();
        
        if (response.ok) {
            // Show checkout link modal
            showCheckoutModal(session);
        } else {
            alert('Error creating checkout session: ' + session.error);
        }
    } catch (error) {
        console.error('Error creating checkout session:', error);
        alert('Error creating checkout session');
    }
}

function showCheckoutModal(session) {
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = `
        <h2>Checkout Session Created</h2>
        <p>Your secure checkout link has been created. Share this link with your customer to collect payment.</p>
        
        <div class="checkout-info">
            <div class="form-group">
                <label>Checkout URL:</label>
                <div class="url-container">
                    <input type="text" id="checkoutUrl" value="${session.url}" readonly style="width: 100%; margin-bottom: 10px;">
                    <button type="button" id="copyUrl" class="btn-secondary" style="width: 100%;">Copy Link</button>
                </div>
            </div>
            
            <div class="session-details" style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 5px;">
                <h4>Session Details:</h4>
                <p><strong>Session ID:</strong> ${session.id}</p>
                <p><strong>Amount:</strong> $${(session.amount_total / 100).toFixed(2)}</p>
                <p><strong>Status:</strong> ${session.status}</p>
                <p><strong>Expires:</strong> ${new Date(session.expires_at * 1000).toLocaleString()}</p>
            </div>
        </div>
        
        <div class="form-actions" style="margin-top: 20px;">
            <button type="button" id="openCheckout" class="btn-primary">Open Checkout</button>
            <button type="button" id="shareByEmail" class="btn-secondary">Share by Email</button>
        </div>
    `;
    
    // Set up button handlers
    document.getElementById('copyUrl').addEventListener('click', () => {
        const urlInput = document.getElementById('checkoutUrl');
        urlInput.select();
        document.execCommand('copy');
        alert('Checkout URL copied to clipboard!');
    });
    
    document.getElementById('openCheckout').addEventListener('click', () => {
        window.open(session.url, '_blank');
    });
    
    document.getElementById('shareByEmail').addEventListener('click', () => {
        const subject = encodeURIComponent(`Payment Request - Invoice ${session.metadata?.invoice_number || session.id}`);
        const body = encodeURIComponent(`Hello,

Please complete your payment using the secure checkout link below:

${session.url}

Amount: $${(session.amount_total / 100).toFixed(2)}
${session.metadata?.invoice_number ? `Invoice: ${session.metadata.invoice_number}` : ''}

Thank you!`);
        
        window.location.href = `mailto:${session.customer_email || ''}?subject=${subject}&body=${body}`;
    });
    
    document.getElementById('modal').style.display = 'block';
}

async function sendInvoiceEmail(id) {
    try {
        await fetch(`${API_URL}/invoices/${id}/send`, { method: 'POST' });
        alert('Invoice sent successfully!');
        previewModal.style.display = 'none';
    } catch (error) {
        console.error('Error sending invoice:', error);
        alert('Error sending invoice');
    }
}

async function deleteCustomer(id) {
    if (confirm('Are you sure you want to delete this customer?')) {
        try {
            await fetch(`${API_URL}/customers/${id}`, { method: 'DELETE' });
            loadCustomers();
        } catch (error) {
            console.error('Error deleting customer:', error);
        }
    }
}

async function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        try {
            await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
            loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }
}

function filterInvoices() {
    const searchTerm = document.getElementById('searchInvoices').value.toLowerCase();
    const statusFilter = document.getElementById('statusFilter').value;
    
    const rows = document.querySelectorAll('#invoicesTable tbody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        const status = row.querySelector('.status').textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || text.includes(searchTerm);
        const matchesStatus = statusFilter === '' || status === statusFilter;
        
        row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
}

// Add event listeners for line items
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('item-quantity') || e.target.classList.contains('item-price')) {
        updateLineItem(e);
    }
});
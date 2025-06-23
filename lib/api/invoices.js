// Invoices API - List and manage invoices
import { requireAuth } from '../../api/middleware/auth.js';
import db from '../db.js';
import { getPaginationParams } from '../db.js';

export default async function handler(req, res) {
    // Apply authentication
    await requireAuth(req, res, async () => {
        const { user } = req;
        const invoiceId = req.invoiceId; // Set by router for /api/invoices/:id
        
        switch (req.method) {
            case 'GET':
                if (invoiceId) {
                    // Get specific invoice
                    try {
                        const invoice = await db.invoice.findFirst({
                            where: {
                                id: invoiceId,
                                OR: [
                                    { userId: user.id },
                                    { createdById: user.id }
                                ]
                            }
                        });
                        
                        if (!invoice) {
                            return res.status(404).json({ error: 'Invoice not found' });
                        }
                        
                        return res.status(200).json(invoice);
                    } catch (error) {
                        console.error('Error fetching invoice:', error);
                        return res.status(500).json({ error: 'Failed to fetch invoice' });
                    }
                }
                
                // List user's invoices
                try {
                    const { skip, take, page, limit } = getPaginationParams(req.query);
                    const { status } = req.query;
                    
                    const where = { userId: user.id };
                    if (status) {
                        where.status = status;
                    }
                    
                    const invoices = await db.invoice.findMany({
                        where,
                        orderBy: { createdAt: 'desc' },
                        skip,
                        take,
                        select: {
                            id: true,
                            number: true,
                            amount: true,
                            currency: true,
                            status: true,
                            dueDate: true,
                            paidAt: true,
                            createdAt: true,
                            items: true
                        }
                    });
                    
                    const total = await db.invoice.count({ where });
                    
                    res.status(200).json({
                        invoices,
                        pagination: {
                            page,
                            limit,
                            total,
                            pages: Math.ceil(total / limit)
                        }
                    });
                } catch (error) {
                    console.error('Error fetching invoices:', error);
                    res.status(500).json({ error: 'Failed to fetch invoices' });
                }
                break;
                
            case 'POST':
                // Create new invoice (admin only)
                if (user.role !== 'admin') {
                    return res.status(403).json({ error: 'Admin access required' });
                }
                
                try {
                    const { clientId, items, dueDate, notes } = req.body;
                    
                    // Validate required fields
                    if (!clientId || !items || !Array.isArray(items) || items.length === 0) {
                        return res.status(400).json({ 
                            error: 'Missing required fields',
                            fields: {
                                clientId: !clientId ? 'Client ID is required' : null,
                                items: !items || !Array.isArray(items) || items.length === 0 ? 'At least one item is required' : null
                            }
                        });
                    }
                    
                    // Calculate total amount
                    const amount = items.reduce((sum, item) => {
                        return sum + (item.quantity * item.unitPrice);
                    }, 0);
                    
                    // Generate invoice number
                    const year = new Date().getFullYear();
                    const count = await db.invoice.count({
                        where: {
                            createdAt: {
                                gte: new Date(`${year}-01-01`),
                                lt: new Date(`${year + 1}-01-01`)
                            }
                        }
                    });
                    const invoiceNumber = `INV-${year}-${String(count + 1).padStart(4, '0')}`;
                    
                    // Create invoice
                    const invoice = await db.invoice.create({
                        data: {
                            userId: clientId,
                            number: invoiceNumber,
                            amount,
                            currency: 'usd',
                            status: 'pending',
                            dueDate: dueDate ? new Date(dueDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                            items,
                            notes
                        }
                    });
                    
                    res.status(201).json({
                        success: true,
                        invoice
                    });
                    
                } catch (error) {
                    console.error('Error creating invoice:', error);
                    res.status(500).json({ error: 'Failed to create invoice' });
                }
                break;
                
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    });
}
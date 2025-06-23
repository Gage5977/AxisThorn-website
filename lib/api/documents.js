// Documents API Handler
import { requireAuth } from '../../api/middleware/auth.js';
import db from '../db.js';
import { getPaginationParams } from '../db.js';
import { validateRequest } from '../validation.js';

export default async function handler(req, res) {
    // Apply authentication
    await requireAuth(req, res, async () => {
        const { user } = req;
        const documentId = req.documentId; // Set by router for /api/documents/:id
        
        switch (req.method) {
            case 'GET':
                if (documentId) {
                    // Get specific document
                    return getDocument(req, res, documentId);
                }
                // List documents
                return listDocuments(req, res);
                
            case 'POST':
                // Upload new document
                return uploadDocument(req, res);
                
            case 'DELETE':
                if (documentId) {
                    // Delete document
                    return deleteDocument(req, res, documentId);
                }
                return res.status(405).json({ error: 'Method not allowed' });
                
            default:
                return res.status(405).json({ error: 'Method not allowed' });
        }
    });
}

async function listDocuments(req, res) {
    try {
        const { user } = req;
        const { skip, take, page, limit } = getPaginationParams(req.query);
        
        // Mock document list for now
        const documents = [
            {
                id: 'doc_1',
                name: 'Financial Report Q4 2024.pdf',
                size: 2456789,
                type: 'application/pdf',
                uploadedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                url: '/api/documents/doc_1'
            },
            {
                id: 'doc_2',
                name: 'AI Strategy Presentation.pptx',
                size: 5678901,
                type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                uploadedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
                url: '/api/documents/doc_2'
            }
        ];
        
        res.status(200).json({
            documents,
            pagination: {
                page,
                limit,
                total: documents.length,
                pages: Math.ceil(documents.length / limit)
            }
        });
    } catch (error) {
        console.error('List documents error:', error);
        res.status(500).json({ error: 'Failed to list documents' });
    }
}

async function getDocument(req, res, documentId) {
    try {
        // In production, fetch from database and return file
        res.status(200).json({
            id: documentId,
            name: 'Document.pdf',
            size: 1234567,
            type: 'application/pdf',
            uploadedAt: new Date(),
            url: `/api/documents/${documentId}/download`
        });
    } catch (error) {
        console.error('Get document error:', error);
        res.status(500).json({ error: 'Failed to get document' });
    }
}

async function uploadDocument(req, res) {
    const schema = {
        name: { required: true, type: 'string', minLength: 1, maxLength: 255 },
        type: { required: true, type: 'string' },
        size: { required: true, type: 'number', min: 1, max: 10485760 } // 10MB max
    };
    
    const validation = validateRequest(req.body, schema);
    if (!validation.valid) {
        return res.status(400).json({ errors: validation.errors });
    }
    
    try {
        // In production, save to S3 or similar
        const document = {
            id: 'doc_' + Date.now(),
            ...validation.data,
            uploadedAt: new Date(),
            userId: req.user.id
        };
        
        res.status(201).json(document);
    } catch (error) {
        console.error('Upload document error:', error);
        res.status(500).json({ error: 'Failed to upload document' });
    }
}

async function deleteDocument(req, res, documentId) {
    try {
        // In production, verify ownership and delete from storage
        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Delete document error:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
}
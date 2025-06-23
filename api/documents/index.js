import { authenticateToken } from '../middleware/auth.js';
import { validateRequest, sanitizeInput } from '../middleware/validation.js';
import { standardRateLimit } from '../middleware/rate-limit.js';
import crypto from 'crypto';

// Mock document storage (in production, use database and file storage)
const documents = new Map();

const uploadSchema = {
  body: {
    name: {
      required: true,
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    type: {
      required: true,
      type: 'string',
      pattern: /^(pdf|doc|docx|xls|xlsx|png|jpg|jpeg)$/i
    },
    size: {
      required: true,
      type: 'number',
      max: 10485760 // 10MB
    },
    content: {
      required: true,
      type: 'string'
    }
  }
};

export default async function handler(req, res) {
  // Apply rate limiting
  await new Promise((resolve) => {
    standardRateLimit(req, res, resolve);
  });
  
  if (res.headersSent) return;

  // Apply authentication
  await new Promise((resolve) => {
    authenticateToken(req, res, resolve);
  });
  
  if (res.headersSent) return;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.NODE_ENV === 'development' ? '*' : 'https://axisthorn.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    default:
      res.status(405).json({ error: 'Method not allowed' });
  }
}

// Get user's documents
async function handleGet(req, res) {
  try {
    const userId = req.user.userId;
    
    // Get user's documents
    const userDocs = [];
    for (const [id, doc] of documents) {
      if (doc.userId === userId) {
        userDocs.push({
          id,
          name: doc.name,
          type: doc.type,
          size: doc.size,
          uploadedAt: doc.uploadedAt,
          sharedWith: doc.sharedWith,
          tags: doc.tags
        });
      }
    }
    
    // Sort by upload date
    userDocs.sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
    
    res.status(200).json({
      success: true,
      documents: userDocs,
      count: userDocs.length
    });
    
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({
      error: 'Failed to fetch documents'
    });
  }
}

// Upload document
async function handlePost(req, res) {
  const validation = validateRequest(uploadSchema);
  validation(req, res, async () => {
    try {
      const { name, type, size, content } = req.body;
      const userId = req.user.userId;
      
      // Generate document ID
      const docId = crypto.randomBytes(16).toString('hex');
      
      // Create document record
      const document = {
        id: docId,
        userId,
        name: sanitizeInput(name),
        type: type.toLowerCase(),
        size,
        uploadedAt: new Date().toISOString(),
        sharedWith: [],
        tags: [],
        // In production, store content in file storage (S3, etc)
        contentUrl: `https://storage.axisthorn.com/documents/${docId}`,
        checksum: crypto.createHash('sha256').update(content).digest('hex')
      };
      
      // Save document
      documents.set(docId, document);
      
      // Return success
      res.status(201).json({
        success: true,
        document: {
          id: document.id,
          name: document.name,
          type: document.type,
          size: document.size,
          uploadedAt: document.uploadedAt
        },
        message: 'Document uploaded successfully'
      });
      
    } catch (error) {
      console.error('Error uploading document:', error);
      res.status(500).json({
        error: 'Failed to upload document'
      });
    }
  });
}

// Delete document
async function handleDelete(req, res) {
  try {
    const docId = req.query.id;
    const userId = req.user.userId;
    
    if (!docId) {
      return res.status(400).json({
        error: 'Document ID required'
      });
    }
    
    // Get document
    const document = documents.get(docId);
    
    if (!document) {
      return res.status(404).json({
        error: 'Document not found'
      });
    }
    
    // Check ownership
    if (document.userId !== userId) {
      return res.status(403).json({
        error: 'Unauthorized to delete this document'
      });
    }
    
    // Delete document
    documents.delete(docId);
    
    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({
      error: 'Failed to delete document'
    });
  }
}
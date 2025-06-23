// Admin Client Notes API
import { verifyAuth } from '../../../middleware/auth.js';
import { validateRequest } from '../../../middleware/validate-request.js';

// Mock notes storage - in production, use a real database
const mockNotes = {
    'client_1': [
        {
            id: 'note_1',
            clientId: 'client_1',
            content: 'Initial consultation went well. Client is interested in full financial system automation.',
            author: 'Admin User',
            authorId: 'admin_1',
            createdAt: new Date(Date.now() - 7 * 24 * 3600000).toISOString()
        },
        {
            id: 'note_2',
            clientId: 'client_1',
            content: 'Follow-up meeting scheduled for next week to discuss portfolio engineering requirements.',
            author: 'Admin User',
            authorId: 'admin_1',
            createdAt: new Date(Date.now() - 3 * 24 * 3600000).toISOString()
        }
    ],
    'client_2': [
        {
            id: 'note_3',
            clientId: 'client_2',
            content: 'Client requested additional features for contract automation system.',
            author: 'Admin User',
            authorId: 'admin_1',
            createdAt: new Date(Date.now() - 2 * 24 * 3600000).toISOString()
        }
    ]
};

const noteSchema = {
    content: {
        required: true,
        type: 'string',
        minLength: 1,
        maxLength: 5000
    }
};

export default async function handler(req, res) {
    // Extract client ID from URL
    const { id } = req.query;
    
    if (!id) {
        res.status(400).json({ error: 'Client ID required' });
        return;
    }

    // Verify authentication and admin role
    const authResult = verifyAuth(req);
    if (!authResult.authenticated) {
        res.status(401).json({ error: 'Authentication required' });
        return;
    }

    if (authResult.user.role !== 'admin') {
        res.status(403).json({ error: 'Admin access required' });
        return;
    }

    switch (req.method) {
        case 'GET':
            // Get notes for client
            try {
                const notes = mockNotes[id] || [];
                res.status(200).json(notes);
            } catch (error) {
                console.error('Notes fetch error:', error);
                res.status(500).json({ error: 'Failed to fetch notes' });
            }
            break;

        case 'POST':
            // Add new note
            try {
                const validation = validateRequest(req.body, noteSchema);
                if (!validation.valid) {
                    res.status(400).json({ errors: validation.errors });
                    return;
                }

                const newNote = {
                    id: `note_${Date.now()}`,
                    clientId: id,
                    content: req.body.content,
                    author: authResult.user.name || 'Admin User',
                    authorId: authResult.user.id,
                    createdAt: new Date().toISOString()
                };

                if (!mockNotes[id]) {
                    mockNotes[id] = [];
                }
                mockNotes[id].unshift(newNote);

                res.status(201).json(newNote);
            } catch (error) {
                console.error('Note creation error:', error);
                res.status(500).json({ error: 'Failed to create note' });
            }
            break;

        case 'DELETE':
            // Delete note
            try {
                const { noteId } = req.query;
                if (!noteId) {
                    res.status(400).json({ error: 'Note ID required' });
                    return;
                }

                if (!mockNotes[id]) {
                    res.status(404).json({ error: 'Note not found' });
                    return;
                }

                const noteIndex = mockNotes[id].findIndex(n => n.id === noteId);
                if (noteIndex === -1) {
                    res.status(404).json({ error: 'Note not found' });
                    return;
                }

                // Check if user can delete note (only author or super admin)
                const note = mockNotes[id][noteIndex];
                if (note.authorId !== authResult.user.id && authResult.user.role !== 'superadmin') {
                    res.status(403).json({ error: 'You can only delete your own notes' });
                    return;
                }

                mockNotes[id].splice(noteIndex, 1);
                res.status(204).end();
            } catch (error) {
                console.error('Note deletion error:', error);
                res.status(500).json({ error: 'Failed to delete note' });
            }
            break;

        default:
            res.status(405).json({ error: 'Method not allowed' });
    }
}
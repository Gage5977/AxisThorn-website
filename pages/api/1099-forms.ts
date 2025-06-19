import { NextApiRequest, NextApiResponse } from 'next';

// In production, this would connect to a database
let forms1099 = [
  { 
    id: '1099-001', 
    year: 2024, 
    recipient: 'John Consultant', 
    recipientTIN: '45-1234567',
    amount: 45000, 
    status: 'Sent',
    boxAmounts: { box7_nonemployeeComp: 45000 }
  },
  { 
    id: '1099-002', 
    year: 2024, 
    recipient: 'Sarah Developer', 
    recipientTIN: '123-45-6789',
    amount: 65000, 
    status: 'Sent',
    boxAmounts: { box7_nonemployeeComp: 65000 }
  },
  { 
    id: '1099-003', 
    year: 2023, 
    recipient: 'Mike Designer', 
    recipientTIN: '98-7654321',
    amount: 38000, 
    status: 'Filed',
    boxAmounts: { box7_nonemployeeComp: 38000 }
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // Get all 1099 forms or filter by year
      const { year } = req.query;
      const filteredForms = year 
        ? forms1099.filter(f => f.year === parseInt(year as string))
        : forms1099;
      
      res.status(200).json({ forms: filteredForms });
      break;

    case 'POST':
      // Create new 1099 form
      const newForm = {
        id: `1099-${Date.now()}`,
        ...req.body,
        status: 'Draft'
      };
      
      forms1099.push(newForm);
      res.status(201).json({ form: newForm });
      break;

    case 'PUT':
      // Update existing form
      const { id } = req.query;
      const formIndex = forms1099.findIndex(f => f.id === id);
      
      if (formIndex === -1) {
        res.status(404).json({ error: 'Form not found' });
        return;
      }
      
      forms1099[formIndex] = { ...forms1099[formIndex], ...req.body };
      res.status(200).json({ form: forms1099[formIndex] });
      break;

    case 'DELETE':
      // Delete form (only if status is Draft)
      const deleteId = req.query.id as string;
      const deleteIndex = forms1099.findIndex(f => f.id === deleteId);
      
      if (deleteIndex === -1) {
        res.status(404).json({ error: 'Form not found' });
        return;
      }
      
      if (forms1099[deleteIndex].status !== 'Draft') {
        res.status(400).json({ error: 'Can only delete draft forms' });
        return;
      }
      
      forms1099.splice(deleteIndex, 1);
      res.status(200).json({ message: 'Form deleted' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
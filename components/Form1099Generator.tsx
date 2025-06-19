import { useState } from 'react';
import { Form1099Data } from './Terminal1099Integration';

export function Form1099Generator({ onGenerate }: { onGenerate: (form: Form1099Data) => void }) {
  const [formData, setFormData] = useState<Partial<Form1099Data>>({
    year: new Date().getFullYear(),
    status: 'Draft',
    boxAmounts: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newForm: Form1099Data = {
      id: `1099-${Date.now()}`,
      year: formData.year || new Date().getFullYear(),
      recipient: formData.recipient || '',
      recipientTIN: formData.recipientTIN || '',
      amount: formData.amount || 0,
      status: 'Draft',
      boxAmounts: formData.boxAmounts || {}
    };
    
    onGenerate(newForm);
  };

  return (
    <div style={{
      backgroundColor: 'rgba(13, 20, 32, 0.9)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      borderRadius: '12px',
      padding: '2rem',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      <h2 style={{ color: '#06B6D4', marginBottom: '2rem' }}>Generate 1099 Form</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
            Tax Year
          </label>
          <input
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(10, 15, 28, 0.5)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              color: '#E6F8FF'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
            Recipient Name
          </label>
          <input
            type="text"
            value={formData.recipient || ''}
            onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
            placeholder="John Doe Consulting LLC"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(10, 15, 28, 0.5)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              color: '#E6F8FF'
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
            Recipient TIN (EIN or SSN)
          </label>
          <input
            type="text"
            value={formData.recipientTIN || ''}
            onChange={(e) => setFormData({ ...formData, recipientTIN: e.target.value })}
            placeholder="XX-XXXXXXX or XXX-XX-XXXX"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(10, 15, 28, 0.5)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              color: '#E6F8FF'
            }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>Box Amounts</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
                Box 1: Rents
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.boxAmounts?.box1_rents || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  boxAmounts: {
                    ...formData.boxAmounts,
                    box1_rents: parseFloat(e.target.value) || 0
                  }
                })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(10, 15, 28, 0.5)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '6px',
                  color: '#E6F8FF'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
                Box 7: Nonemployee Comp
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.boxAmounts?.box7_nonemployeeComp || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  boxAmounts: {
                    ...formData.boxAmounts,
                    box7_nonemployeeComp: parseFloat(e.target.value) || 0
                  }
                })}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: 'rgba(10, 15, 28, 0.5)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '6px',
                  color: '#E6F8FF'
                }}
              />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', color: '#A0AEC0', marginBottom: '0.5rem' }}>
            Total Amount
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.amount || ''}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(10, 15, 28, 0.5)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '6px',
              color: '#E6F8FF',
              fontSize: '1.125rem',
              fontWeight: 'bold'
            }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '1rem',
            backgroundColor: '#3F72AF',
            color: '#E6F8FF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Generate 1099 Form
        </button>
      </form>

      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: 'rgba(10, 15, 28, 0.5)', borderRadius: '8px' }}>
        <p style={{ color: '#A0AEC0', fontSize: '0.875rem', margin: 0 }}>
          <strong>Note:</strong> This will create a draft 1099 form. Use the AXIS Terminal to:
        </p>
        <ul style={{ color: '#A0AEC0', fontSize: '0.875rem', marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Validate form data with command: <code style={{ color: '#06B6D4' }}>validate 1099</code></li>
          <li>Calculate tax implications: <code style={{ color: '#06B6D4' }}>tax strategy</code></li>
          <li>Generate IRS e-file format: <code style={{ color: '#06B6D4' }}>export 1099 efile</code></li>
        </ul>
      </div>
    </div>
  );
}
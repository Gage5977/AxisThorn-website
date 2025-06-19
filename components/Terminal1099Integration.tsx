import { useState } from 'react';

export interface Form1099Data {
  id: string;
  year: number;
  recipient: string;
  recipientTIN: string;
  amount: number;
  status: 'Draft' | 'Sent' | 'Filed';
  boxAmounts: {
    box1_rents?: number;
    box2_royalties?: number;
    box3_other?: number;
    box4_federalTax?: number;
    box7_nonemployeeComp?: number;
  };
}

export const Terminal1099Commands = {
  analyze1099: (forms: Form1099Data[]) => {
    const totalAmount = forms.reduce((sum, form) => sum + form.amount, 0);
    const byYear = forms.reduce((acc, form) => {
      acc[form.year] = (acc[form.year] || 0) + form.amount;
      return acc;
    }, {} as Record<number, number>);
    
    const byRecipient = forms.reduce((acc, form) => {
      acc[form.recipient] = (acc[form.recipient] || 0) + form.amount;
      return acc;
    }, {} as Record<string, number>);

    return `1099 Analysis Report:

• Total 1099 Payments: $${totalAmount.toLocaleString()}
• Forms Issued: ${forms.length}
• Tax Years: ${Object.keys(byYear).join(', ')}

By Year:
${Object.entries(byYear).map(([year, amount]) => 
  `  - ${year}: $${amount.toLocaleString()}`
).join('\n')}

Top Recipients:
${Object.entries(byRecipient)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([recipient, amount]) => 
    `  - ${recipient}: $${amount.toLocaleString()}`
  ).join('\n')}

Tax Optimization Suggestions:
• Consider quarterly estimated tax payments for amounts over $10,000
• Ensure proper classification (employee vs contractor)
• Verify backup withholding requirements`;
  },

  generateTaxStrategy: (forms: Form1099Data[]) => {
    const currentYear = new Date().getFullYear();
    const currentYearForms = forms.filter(f => f.year === currentYear);
    const projectedTax = currentYearForms.reduce((sum, f) => sum + f.amount, 0) * 0.3;

    return `Tax Strategy for 1099 Income:

Current Year (${currentYear}) Analysis:
• Projected 1099 Income: $${currentYearForms.reduce((sum, f) => sum + f.amount, 0).toLocaleString()}
• Estimated Tax Liability: $${projectedTax.toLocaleString()}
• Quarterly Payment Needed: $${(projectedTax / 4).toLocaleString()}

Deduction Opportunities:
• Business expenses deductible against 1099 income
• Home office deduction (if eligible)
• Vehicle expenses for business use
• Professional development and training
• Business insurance premiums

Action Items:
1. Set aside 30-35% of 1099 income for taxes
2. Make quarterly estimated tax payments
3. Track all business expenses meticulously
4. Consider retirement contributions (SEP-IRA, Solo 401k)
5. Review entity structure (LLC vs S-Corp) for tax efficiency`;
  },

  validate1099: (form: Form1099Data) => {
    const errors = [];
    
    if (!form.recipientTIN || !form.recipientTIN.match(/^\d{2}-\d{7}$|^\d{3}-\d{2}-\d{4}$/)) {
      errors.push('Invalid TIN format');
    }
    
    if (form.amount < 600 && form.status !== 'Draft') {
      errors.push('1099 typically required only for payments >= $600');
    }
    
    if (!form.boxAmounts || Object.values(form.boxAmounts).every(v => !v)) {
      errors.push('No box amounts specified');
    }
    
    const boxTotal = Object.values(form.boxAmounts || {}).reduce((sum, val) => sum + (val || 0), 0);
    if (Math.abs(boxTotal - form.amount) > 0.01) {
      errors.push('Box amounts do not match total amount');
    }

    return errors.length === 0 
      ? '✓ 1099 validation passed'
      : `⚠️ Validation issues:\n${errors.map(e => `  - ${e}`).join('\n')}`;
  }
};

export function Terminal1099Integration({ forms }: { forms: Form1099Data[] }) {
  const [selectedForm, setSelectedForm] = useState<Form1099Data | null>(null);

  return (
    <div style={{
      backgroundColor: 'rgba(13, 20, 32, 0.9)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      borderRadius: '12px',
      padding: '1.5rem',
      marginTop: '1rem'
    }}>
      <h3 style={{ color: '#06B6D4', marginBottom: '1rem' }}>1099 Terminal Commands</h3>
      
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button
          onClick={() => console.log(Terminal1099Commands.analyze1099(forms))}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3F72AF',
            color: '#E6F8FF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Analyze All 1099s
        </button>
        
        <button
          onClick={() => console.log(Terminal1099Commands.generateTaxStrategy(forms))}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#10B981',
            color: '#E6F8FF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Generate Tax Strategy
        </button>
        
        <button
          onClick={() => {
            if (selectedForm) {
              console.log(Terminal1099Commands.validate1099(selectedForm));
            }
          }}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#F59E0B',
            color: '#E6F8FF',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            opacity: selectedForm ? 1 : 0.5
          }}
          disabled={!selectedForm}
        >
          Validate Selected
        </button>
      </div>

      <div style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>
        <p>Available commands in terminal:</p>
        <code style={{ color: '#06B6D4' }}>analyze 1099</code> - Full 1099 analysis<br/>
        <code style={{ color: '#06B6D4' }}>tax strategy</code> - Generate tax optimization plan<br/>
        <code style={{ color: '#06B6D4' }}>validate 1099 [id]</code> - Validate specific form<br/>
        <code style={{ color: '#06B6D4' }}>estimate quarterly</code> - Calculate quarterly payments
      </div>
    </div>
  );
}
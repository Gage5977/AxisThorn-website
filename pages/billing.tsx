import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Billing() {
  const router = useRouter();
  const [activeView, setActiveView] = useState('dashboard');

  // Demo data
  const demoInvoices = [
    { id: 'INV-001', client: 'Acme Corp', amount: 5000, status: 'Paid', date: '2025-01-01' },
    { id: 'INV-002', client: 'Tech Innovations', amount: 7500, status: 'Pending', date: '2025-01-15' },
    { id: 'INV-003', client: 'Global Finance', amount: 12000, status: 'Paid', date: '2025-01-20' }
  ];

  const demoTransactions = [
    { id: 'TXN-001', description: 'Client Payment - Acme Corp', amount: 5000, date: '2025-01-05', type: 'credit' },
    { id: 'TXN-002', description: 'Office Supplies', amount: -250, date: '2025-01-10', type: 'debit' },
    { id: 'TXN-003', description: 'Client Payment - Global Finance', amount: 12000, date: '2025-01-22', type: 'credit' }
  ];

  const demo1099s = [
    { id: '1099-001', year: 2024, recipient: 'John Consultant', amount: 45000, status: 'Sent' },
    { id: '1099-002', year: 2024, recipient: 'Sarah Developer', amount: 65000, status: 'Sent' },
    { id: '1099-003', year: 2023, recipient: 'Mike Designer', amount: 38000, status: 'Filed' }
  ];

  const renderDashboard = () => (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        marginBottom: '3rem'
      }}>
        <div style={{
          backgroundColor: 'rgba(13, 20, 32, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#A0AEC0', fontSize: '0.875rem', marginBottom: '1rem' }}>Total Revenue</h3>
          <p style={{ fontSize: '2rem', color: '#06B6D4', fontWeight: 'bold' }}>$24,500</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(13, 20, 32, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#A0AEC0', fontSize: '0.875rem', marginBottom: '1rem' }}>Pending Invoices</h3>
          <p style={{ fontSize: '2rem', color: '#F59E0B', fontWeight: 'bold' }}>$7,500</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(13, 20, 32, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#A0AEC0', fontSize: '0.875rem', marginBottom: '1rem' }}>Bank Balance</h3>
          <p style={{ fontSize: '2rem', color: '#10B981', fontWeight: 'bold' }}>$156,750</p>
        </div>
        <div style={{
          backgroundColor: 'rgba(13, 20, 32, 0.9)',
          border: '1px solid rgba(6, 182, 212, 0.2)',
          borderRadius: '12px',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#A0AEC0', fontSize: '0.875rem', marginBottom: '1rem' }}>1099s Issued</h3>
          <p style={{ fontSize: '2rem', color: '#3F72AF', fontWeight: 'bold' }}>3</p>
        </div>
      </div>
      <div style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <h3 style={{ color: '#06B6D4', marginBottom: '1.5rem' }}>Recent Activity</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(10, 15, 28, 0.5)', borderRadius: '8px' }}>
            <span style={{ color: '#10B981' }}>✓</span> Invoice INV-001 paid by Acme Corp - $5,000
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(10, 15, 28, 0.5)', borderRadius: '8px' }}>
            <span style={{ color: '#F59E0B' }}>⏳</span> Invoice INV-002 sent to Tech Innovations - $7,500
          </div>
          <div style={{ padding: '1rem', backgroundColor: 'rgba(10, 15, 28, 0.5)', borderRadius: '8px' }}>
            <span style={{ color: '#3F72AF' }}>📄</span> 1099 forms ready for tax year 2024
          </div>
        </div>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div style={{
      backgroundColor: 'rgba(13, 20, 32, 0.9)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      borderRadius: '12px',
      padding: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#06B6D4' }}>Invoices</h3>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3F72AF',
          color: '#E6F8FF',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Create Invoice
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Invoice #</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Client</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Amount</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Status</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {demoInvoices.map(invoice => (
            <tr key={invoice.id}>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{invoice.id}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{invoice.client}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>${invoice.amount.toLocaleString()}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px',
                  backgroundColor: invoice.status === 'Paid' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                  color: invoice.status === 'Paid' ? '#10B981' : '#F59E0B'
                }}>
                  {invoice.status}
                </span>
              </td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{invoice.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBanking = () => (
    <div>
      <div style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '12px',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ color: '#06B6D4', marginBottom: '1.5rem' }}>Bank Accounts</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(10, 15, 28, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.1)'
          }}>
            <h4 style={{ color: '#E6F8FF', marginBottom: '0.5rem' }}>Business Checking</h4>
            <p style={{ color: '#A0AEC0', fontSize: '0.875rem' }}>****1234</p>
            <p style={{ fontSize: '1.5rem', color: '#10B981', fontWeight: 'bold', marginTop: '1rem' }}>$156,750.00</p>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: 'rgba(10, 15, 28, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(6, 182, 212, 0.1)'
          }}>
            <h4 style={{ color: '#E6F8FF', marginBottom: '0.5rem' }}>Business Savings</h4>
            <p style={{ color: '#A0AEC0', fontSize: '0.875rem' }}>****5678</p>
            <p style={{ fontSize: '1.5rem', color: '#10B981', fontWeight: 'bold', marginTop: '1rem' }}>$250,000.00</p>
          </div>
        </div>
      </div>
      <div style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        border: '1px solid rgba(6, 182, 212, 0.2)',
        borderRadius: '12px',
        padding: '2rem'
      }}>
        <h3 style={{ color: '#06B6D4', marginBottom: '1.5rem' }}>Recent Transactions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Date</th>
              <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Description</th>
              <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {demoTransactions.map(txn => (
              <tr key={txn.id}>
                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{txn.date}</td>
                <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{txn.description}</td>
                <td style={{ 
                  padding: '1rem', 
                  borderBottom: '1px solid rgba(6, 182, 212, 0.1)',
                  textAlign: 'right',
                  color: txn.type === 'credit' ? '#10B981' : '#EF4444'
                }}>
                  {txn.type === 'credit' ? '+' : ''}{txn.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const render1099 = () => (
    <div style={{
      backgroundColor: 'rgba(13, 20, 32, 0.9)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      borderRadius: '12px',
      padding: '2rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h3 style={{ color: '#06B6D4' }}>1099 Forms</h3>
        <button style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3F72AF',
          color: '#E6F8FF',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}>
          Generate 1099
        </button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Form ID</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Year</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Recipient</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Amount</th>
            <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid rgba(6, 182, 212, 0.2)', color: '#A0AEC0' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {demo1099s.map(form => (
            <tr key={form.id}>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{form.id}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{form.year}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>{form.recipient}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>${form.amount.toLocaleString()}</td>
              <td style={{ padding: '1rem', borderBottom: '1px solid rgba(6, 182, 212, 0.1)' }}>
                <span style={{ 
                  padding: '0.25rem 0.75rem', 
                  borderRadius: '4px',
                  backgroundColor: form.status === 'Filed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(63, 114, 175, 0.2)',
                  color: form.status === 'Filed' ? '#10B981' : '#3F72AF'
                }}>
                  {form.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0F1C',
      color: '#E6F8FF',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'rgba(13, 20, 32, 0.9)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        padding: '1rem 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', color: '#06B6D4', margin: 0 }}>Billing Portal</h1>
            <nav style={{ display: 'flex', gap: '1.5rem' }}>
              <a href="/" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Home</a>
              <a href="/terminal" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Terminal</a>
              <a href="/axis-ai" style={{ color: '#A0AEC0', textDecoration: 'none' }}>Axis AI</a>
            </nav>
          </div>
          <button
            onClick={() => {
              document.cookie = 'subscribed_user=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT';
              router.push('/');
            }}
            style={{
              padding: '0.5rem 1rem',
              background: 'transparent',
              border: '1px solid #EF4444',
              borderRadius: '6px',
              color: '#EF4444',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap'
          }}>
            {['dashboard', 'invoices', 'banking', '1099'].map(view => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: activeView === view ? 'rgba(6, 182, 212, 0.2)' : 'transparent',
                  border: `1px solid ${activeView === view ? '#06B6D4' : 'rgba(6, 182, 212, 0.2)'}`,
                  borderRadius: '8px',
                  color: activeView === view ? '#06B6D4' : '#A0AEC0',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
                }}
              >
                {view === '1099' ? '1099 Forms' : view}
              </button>
            ))}
          </div>

          {/* Content Area */}
          {activeView === 'dashboard' && renderDashboard()}
          {activeView === 'invoices' && renderInvoices()}
          {activeView === 'banking' && renderBanking()}
          {activeView === '1099' && render1099()}
        </div>
      </main>
    </div>
  );
}
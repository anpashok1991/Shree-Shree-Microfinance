import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerApi, resolveUrl } from '../../services/api';
import Loading from '../../components/common/Loading';
import { ArrowLeft, Edit, Trash2, FileText, Image } from 'lucide-react';

export default function CustomerDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    customerApi.getById(id!)
      .then((r) => setCustomer(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!customer) return <div className="empty-state">Customer not found</div>;

  const badges: any = { ACTIVE: 'badge-success', PENDING: 'badge-warning', CLOSED: 'badge-secondary', BLACKLISTED: 'badge-danger' };

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <button className="btn btn-secondary btn-sm" onClick={() => navigate('/customers')}><ArrowLeft size={16} /> Back</button>
        <h1 className="header-title" style={{ flex: 1 }}>{customer.name}</h1>
        <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/customers/edit/${id}`)}><Edit size={16} /> Edit</button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header"><h3 className="card-title">Personal Details</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '8px' }}>
              <Row label="Customer ID" value={customer.customerId} />
              <Row label="Name" value={customer.name} />
              <Row label="Father's Name" value={customer.fatherName} />
              <Row label="Mobile" value={customer.mobile} />
              <Row label="Aadhaar" value={customer.aadhaarNumber} />
              <Row label="PAN" value={customer.panNumber || '-'} />
              <Row label="Status" value={<span className={`badge ${badges[customer.status]}`}>{customer.status}</span>} />
              {customer.aadhaarCopy && <Row label="Aadhaar Copy" value={<a href={resolveUrl(customer.aadhaarCopy)} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> View</a>} />}
              {customer.panCopy && <Row label="PAN Copy" value={<a href={resolveUrl(customer.panCopy)} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><FileText size={14} /> View</a>} />}
              {customer.photoUpload && <Row label="Photo" value={<a href={resolveUrl(customer.photoUpload)} target="_blank" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Image size={14} /> View</a>} />}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3 className="card-title">Address & Occupation</h3></div>
          <div className="card-body">
            <div style={{ display: 'grid', gap: '8px' }}>
              <Row label="Address" value={customer.address} />
              <Row label="Village" value={customer.village} />
              <Row label="District" value={customer.district} />
              <Row label="State" value={customer.state} />
              <Row label="PIN Code" value={customer.pinCode} />
              <Row label="Occupation" value={customer.occupation} />
              <Row label="Monthly Income" value={customer.monthlyIncome ? `₹${customer.monthlyIncome.toLocaleString()}` : '-'} />
            </div>
          </div>
        </div>
      </div>

      {customer.loans?.length > 0 && (
        <div className="card mt-4">
          <div className="card-header"><h3 className="card-title">Loan History</h3></div>
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Loan #</th>
                    <th>Amount</th>
                    <th>Daily</th>
                    <th>Paid</th>
                    <th>Outstanding</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {customer.loans.map((loan: any) => (
                    <tr key={loan.id} style={{ cursor: 'pointer' }} onClick={() => navigate(`/loans/${loan.id}`)}>
                      <td className="font-medium">{loan.loanNumber}</td>
                      <td>₹{loan.amount.toLocaleString()}</td>
                      <td>₹{loan.dailyCollection}</td>
                      <td>₹{loan.totalPaid.toLocaleString()}</td>
                      <td>₹{loan.outstanding.toLocaleString()}</td>
                      <td><span className={`badge ${badges[loan.status] || 'badge-secondary'}`}>{loan.status}</span></td>
                      <td>{new Date(loan.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button className="btn btn-primary" onClick={() => navigate(`/loans/new?customerId=${customer.id}`)}>Apply New Loan</button>
        <button className="btn btn-success" onClick={() => navigate(`/collections?customerId=${customer.id}`)}>Record Collection</button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <div className="flex items-center justify-between" style={{ padding: '4px 0' }}>
      <span className="text-secondary text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Download, 
  Eye, 
  Trash2, 
  CheckCircle 
} from 'lucide-react';

const RecordCard = ({ record, onDelete }) => (
  <div className="glass-panel" style={{ 
    padding: '20px', 
    display: 'flex', 
    alignItems: 'center', 
    gap: '20px',
    transition: 'var(--transition-smooth)',
    cursor: 'pointer'
  }}>
    <div style={{ 
      width: '50px', 
      height: '50px', 
      borderRadius: '12px', 
      background: 'rgba(46, 255, 162, 0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--primary-mint)'
    }}>
      <FileText size={24} />
    </div>
    
    <div style={{ flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h4 style={{ fontSize: '1.1rem' }}>{record.title}</h4>
        {record.isVerified && <CheckCircle size={14} color="var(--primary-mint)" />}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        {record.category} | {record.doctorName || 'Unknown Specialist'}
      </p>
    </div>

    <div style={{ textAlign: 'right', marginRight: '20px' }}>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-white)' }}>
        {new Date(record.date).toLocaleDateString()}
      </p>
      <p style={{ fontSize: '0.7rem', color: 'var(--primary-mint)' }}>
        {record.encryptionStatus}
      </p>
    </div>

    <div style={{ display: 'flex', gap: '10px' }}>
      <button className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <Eye size={18} />
      </button>
      <button className="btn-icon" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
        <Download size={18} />
      </button>
      <button 
        onClick={() => onDelete(record._id)}
        className="btn-icon" 
        style={{ background: 'none', border: 'none', color: '#ff716c', cursor: 'pointer' }}
      >
        <Trash2 size={18} />
      </button>
    </div>
  </div>
);

const Records = () => {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/records?patientId=${user._id}`);
      setRecords(data);
    } catch (err) {
      console.error('Failed to fetch records');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deauthorize this record?')) {
      try {
        await axios.delete(`http://localhost:5000/api/records/${id}`);
        fetchRecords();
      } catch (err) {
        alert('Failed to delete record');
      }
    }
  };

  return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Health <span className="glowing-text">Archive</span></h1>
          <p style={{ color: 'var(--text-muted)' }}>Secure biological data library | Total Records: {records.length}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={20} />
          Upload New Record
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <div className="glowing-border" style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px', 
          padding: '0 15px', 
          background: 'var(--bg-card)',
          borderRadius: '12px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search records by title, doctor, or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              background: 'transparent', 
              border: 'none', 
              color: 'white', 
              padding: '12px', 
              width: '100%', 
              outline: 'none' 
            }} 
          />
        </div>
        <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={18} />
          Filter
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {records.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase())).length > 0 ? (
          records
            .filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(record => (
              <RecordCard key={record._id} record={record} onDelete={handleDelete} />
            ))
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '100px', 
            border: '1px dashed var(--border-glass)', 
            borderRadius: '16px',
            color: 'var(--text-muted)'
          }}>
            No encrypted records found matching your search.
          </div>
        )}
      </div>

      {/* Add Record Modal Placeholder */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="glass-panel" style={{ padding: '40px', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '24px' }}>Initialize New Record</h2>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={async (e) => {
              e.preventDefault();
              const fData = new FormData(e.target);
              const payload = {
                patientId: user._id,
                title: fData.get('title'),
                category: fData.get('category'),
                doctorName: fData.get('doctor'),
              };
              try {
                await axios.post('http://localhost:5000/api/records', payload);
                setShowAddModal(false);
                fetchRecords();
              } catch (err) { alert('Upload failed'); }
            }}>
              <input name="title" placeholder="Record Title (e.g. Lab Panel X)" required style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '8px', color: 'white' }} />
              <select name="category" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '8px', color: 'white' }}>
                <option value="Lab Report">Lab Report</option>
                <option value="Prescription">Prescription</option>
                <option value="Imaging">Imaging</option>
              </select>
              <input name="doctor" placeholder="Lead Medical Specialist" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', padding: '12px', borderRadius: '8px', color: 'white' }} />
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Deploy Record</button>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-ghost" style={{ flex: 1 }}>Abort</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Records;

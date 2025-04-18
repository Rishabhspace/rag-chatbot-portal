import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RepositoryManager() {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('http://localhost:8000/folders', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setFolders(res.data);
        setError('');
      } catch (error) {
        setError(error.response?.data?.detail || 'Failed to fetch folders');
      }
    };
    fetchFolders();
  }, []);

  return (
    <div className="card">
      <h2 className="card-title">Repository Manager</h2>
      {error && <p className="error">{error}</p>}
      {folders.length === 0 ? (
        <p className="text-sm">No folders available</p>
      ) : (
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li key={folder} className="folder-item">
              {folder}
            </li>
          ))}
        </ul>
      )}
      <p className="text-sm">
        <span
          className="link"
          onClick={() => navigate('/upload')}
        >
          Back to Upload
        </span>
      </p>
    </div>
  );
}

export default RepositoryManager;
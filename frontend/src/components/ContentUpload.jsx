import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ContentUpload() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message);
      setError('');
      setFile(null);
      navigate('/test');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Upload failed';
      setError(errorMessage);
      console.error('Upload error:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Upload Content</h2>
      <div className="mb-4">
        <label htmlFor="file-upload" className="label">
          Select File (PDF)
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="input"
        />
      </div>
      <button
        onClick={handleUpload}
        disabled={!file}
        className="button"
      >
        Upload
      </button>
      {error && <p className="error">{error}</p>}
      <p className="text-sm">
        <span
          className="link"
          onClick={() => navigate('/test')}
        >
          Go to Query Page
        </span>
      </p>
    </div>
  );
}

export default ContentUpload;
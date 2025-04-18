import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ChatbotTest() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [confidence, setConfidence] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleQuery = async () => {
    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}${endpoint}`, {
        email,
        password,
      });
      setResponse(res.data.response);
      setConfidence(res.data.confidence);
      setError('');
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Query failed';
      setError(errorMessage);
      console.error('Query error:', error);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">Test Chatbot</h2>
      <div className="mb-4">
        <label htmlFor="question" className="label">
          Ask a Question
        </label>
        <input
          id="question"
          type="text"
          placeholder="Type your question here"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="input"
        />
      </div>
      <button
        onClick={handleQuery}
        className="button"
        disabled={!question.trim()}
      >
        Ask
      </button>
      {error && <p className="error">{error}</p>}
      {response && (
        <div className="response-box">
          <p className="response-text">
            <strong>Response:</strong> {response}
          </p>
          <p className="response-confidence">
            <strong>Confidence:</strong> {(confidence * 100).toFixed(2)}%
          </p>
        </div>
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

export default ChatbotTest;
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import ContentUpload from './components/ContentUpload';
import ChatbotTest from './components/ChatbotTest';
import RepositoryManager from './components/RepositoryManager';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          RAG Chatbot
        </Link>
        <div className="navbar-links">
          {localStorage.getItem('token') ? (
            <>
              <Link to="/upload">Upload</Link>
              <Link to="/test">Test</Link>
              <Link to="/repository">Repository</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/upload" element={<ContentUpload />} />
          <Route path="/test" element={<ChatbotTest />} />
          <Route path="/repository" element={<RepositoryManager />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
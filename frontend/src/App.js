import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostEditor from './pages/PostEditor';
import Header from './components/Header';
import './App.css';

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem('token');
  return token ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/posts/create" element={<PrivateRoute element={<PostEditor mode="create" />} />} />
          <Route path="/posts/:id/edit" element={<PrivateRoute element={<PostEditor mode="edit" />} />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;

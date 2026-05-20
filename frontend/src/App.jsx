import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Log from './pages/Login';
import Reg from './pages/Register';

const Login = () => <Log />;
const Register = () => <Reg />;
const Dashboard = () => <div className="p-10 text-center text-2xl text-emerald-400">Dashboard (Protected!)</div>;


function App() {

  const isAuthenticated = false; 

  return (
    <BrowserRouter>
      <Routes>

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
        />

        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
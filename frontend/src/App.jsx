import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Log from './pages/Login';
import Reg from './pages/Register';
import Dash from './pages/Dashboard';
import { AuthContext } from './context/AuthContext';
import {useContext, useEffect} from 'react'
import Loader from './pages/Loader';


const Login = () => <Log />;
const Register = () => <Reg />;
const Dashboard = () => <Dash />;


function App() { 
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const {isLoading,setIsLoading}=useContext(AuthContext)
  useEffect( () => {
    const verify= async() => {
        try{
          const response = await fetch('http://localhost:8000/api/user/verify',{
            credentials: 'include'
          })
          if(response.ok){
            setIsAuthenticated(true)
          }
        }
        catch(err){
          console.error("Could not Authenticate: ",err);
        }
        setIsLoading(false);
    }
    verify();
  },[]);

  if(isLoading) return (<Loader />);
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Components/User/Login';
import Register from './Components/User/Register'
import Dashboard from './Components/User/UserProfile';
import AdminLogin from './Components/Admin/AdminLogin';
import AdminDashboard from './Components/Admin/AdminDashBoard';
import AdminProfile from './Components/Admin/AdminProfile';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/userProfile" element={<Dashboard/>} />

          <Route path='/admin/login' element ={<AdminLogin/>}/>
          <Route path='/admin/dashboard' element={<AdminDashboard/>} />
          <Route path='/admin/Profile' element={<AdminProfile/>} />
      </Routes>
    </Router>
  );
}

export default App;
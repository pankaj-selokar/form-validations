import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from './Login';
import Signup from './Signup';
import Home from './Home';
import ForgetPassword from './ForgetPassword';
import { useState } from 'react';

function App() {

  const [blockedUsers, setBlockedUsers] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path='/login' element={<Login blockedUsers={blockedUsers} setBlockedUsers={setBlockedUsers} />}></Route>
        <Route path='/signup' element={<Signup />}></Route>
        <Route path='/home' element={<Home />}></Route>
        <Route path='/forget-password' element={<ForgetPassword />}></Route>
      </Routes>
      <ToastContainer></ToastContainer>
    </Router>
  );
}

export default App;

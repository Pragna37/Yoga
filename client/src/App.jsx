import react from 'react'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Feed from './pages/Feed';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import Profile from './pages/Profile';
import MySessions from './pages/MySessions'


function App() {
  return (  
    <div>
      <ToastContainer/>
     <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/reset-password' element={<ResetPassword/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/feed' element={<Feed/>}/>
      <Route path='/mySessions' element={<MySessions/>}/>
      
     </Routes>
    </div>
  )
}

  

export default App


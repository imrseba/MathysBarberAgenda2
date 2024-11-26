import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from './components/Login';
import { UserPage } from './components/UserPage';
import { AdminPage } from './components/AdminPage';

const App = () => {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/admin" element={ <AdminPage  />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


import React from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { Login } from './components/Login';
import { UserPage } from './components/UserPage';
import { AdminPage } from './components/AdminPage';
import { AdminAvance } from './components/AdminAvance';
import { UserAvance } from './components/UserAvance';

const App = () => {
 
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<UserPage/>} />
        <Route path="/admin" element={ <AdminPage  />} />
        <Route path="/admin/avance" element={ <AdminAvance  />} />
        <Route path="/user/avance" element={ <UserAvance  />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;


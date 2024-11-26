import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if(user){
        if(user.email === 'seba@gmail.com'){
          localStorage.setItem('userEmail', user.email);
          navigate('/admin');
        }
        else{
          localStorage.setItem('userEmail', user.email);
          navigate('/user');
        }
      }
      
    } catch (err) {
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div className='page-container'>
    <form onSubmit={handleLogin}>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Iniciar Sesión</button>
      {error && <p>{error}</p>}
    </form>
    </div>
  );
};

export default Login; 

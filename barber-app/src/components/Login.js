import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { MoonLoader } from 'react-spinners';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if(user){
        if(user.email === 'matia@gmail.com' || user.email === 'seba@gmail.com'){
          localStorage.setItem('userEmail', user.email);
          navigate('/admin');
          setLoading(false);
        }
        else{
          localStorage.setItem('userEmail', user.email);
          navigate('/user');
          setLoading(false);
        }
      }
      
    } catch (err) {
      setLoading(false);
      setError('Credenciales inválidas.');
    }
  };

  return (
    <div className='page-container'>
      {loading && (
        <div className="loading-overlay">
          <MoonLoader size={60} color="#36d7b7" />
        </div>
      )}
    <form onSubmit={handleLogin}>
      <h1>Barber Mathys</h1>
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

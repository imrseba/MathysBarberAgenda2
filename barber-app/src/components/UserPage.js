import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { MoonLoader } from 'react-spinners';
import '../styles/UserPage.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

export const UserPage = () => {
  const [cut, setCut] = useState('');
  const [cutPrice, setCutPrice] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [extra, setExtra] = useState('');
  const [extraPrice, setExtraPrice] = useState(0);
  const [typePay, setTypePay] = useState('Efectivo'); 
  const [loading, setLoading] = useState(false);
  const userEmail = localStorage.getItem('userEmail');
  const navigate = useNavigate();

  const cutPrices = {
    'Corte': 10000,
    'Corte + Barba': 14000,
  };

  const extraPrices = {
    'Ceja': 1000,
    'Barba': 5000,
    'Teñido(Visos)': 30000,
    'Teñido(Global)': 40000,
    'Linea': 2000,
    'Diseño': 4000,
  };

  const handleCutChange = (e) => {
    const selectedCut = e.target.value;
    setCut(selectedCut);
    setCutPrice(cutPrices[selectedCut] || 0);
  };

  const handleExtraChange = (e) => {
    const selectedExtra = e.target.value;
    setExtra(selectedExtra);
    setExtraPrice(extraPrices[selectedExtra] || 0);
  };

  const handleTypePayChange = (e) => {
    setTypePay(e.target.value); 
  };

  const handleSubmit = async () => {
    if (!cut || !date) {
      toast.error('Por favor complete todos los campos.');
      return;
    }

    const confirmationMessage = `
      Detalles de la cita:
      - Corte: ${cut}
      - Precio: ${cutPrice}
      - Fecha: ${date}
      - Extra: ${extra}
      - Precio extra: ${extraPrice}
      - Tipo de pago: ${typePay}
    `;
    const isConfirmed = window.confirm(`¿Estás seguro de que quieres guardar la cita?\n\n${confirmationMessage}`);

    if (isConfirmed) {
      setLoading(true);
      try {
        await addDoc(collection(db, 'citas'), {
          cut,
          cutPrice,
          date,
          extra,
          extraPrice,
          userEmail,
          typePay, 
          createdAt: new Date(),
        });
        toast.success('¡Cita registrada con éxito!');
      } catch (err) {
        console.error('Error al guardar la cita:', err);
        toast.error('Error al guardar la cita.');
      }
      setLoading(false);
    }
  };

  const handleGenerateAvance = async () => {
    navigate('/user/avance');
  };

  return (
    <div className="page-container">
      {loading && (
        <div className="loading-overlay">
          <MoonLoader size={60} color="#36d7b7" />
        </div>
      )}
      <div className="form-container">
        <h1>Agendar Cita</h1>
        <select value={cut} onChange={handleCutChange}>
          <option value="" disabled>Seleccionar corte</option>
          <option value="Corte">Corte</option>
          <option value="Corte + Barba">Corte + Barba</option>
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <select value={extra} onChange={handleExtraChange}>
          <option value="">Ninguno</option>
          <option value="Ceja">Ceja</option>
          <option value="Barba">Barba</option>
          <option value="Linea">Linea</option>
          <option value="Diseño">Diseño</option>
          <option value="Teñido(Visos)">Teñido Visos</option>
          <option value="Teñido(Global)">Teñido Global</option>
        </select>
        <select value={typePay} onChange={handleTypePayChange}>
          <option value="Efectivo">Efectivo</option>
          <option value="Transferencia">Transferencia</option>
          <option value="Debito">Debito</option>
        </select>
        <button onClick={handleSubmit}>Guardar Cita</button>
        <button onClick={handleGenerateAvance}>Ver Avanze</button>
      </div>
      <ToastContainer />
    </div>
  );
};

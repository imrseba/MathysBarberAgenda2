import React, { useEffect, useState, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { MoonLoader } from 'react-spinners';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminAvance.css';

export const UserAvance = () => {
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();
  const userEmail = localStorage.getItem('userEmail'); // Obtén el correo del usuario desde localStorage
  const userName = userEmail ? userEmail.split('@')[0] : '';
  
  const fetchCitas = useCallback(async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'citas'));
      const citasData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(cita => cita.userEmail === userEmail); // Filtrar por correo del usuario

      const sortedCitas = citasData.sort((a, b) => a.date.localeCompare(b.date));
      setCitas(sortedCitas);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    } finally {
      setLoading(false);
    }
  }, [userEmail]); // Add userEmail as a dependency, since it can change

  useEffect(() => {
    fetchCitas();
  }, [fetchCitas]); // Now that fetchCitas is memoized, it can safely be used in the dependencies array

  const totalEfectivoCortes = citas
    .filter(cita => cita.typePay === 'Efectivo')
    .reduce((acc, cita) => acc + (parseInt(cita.cutPrice) || 0), 0);

  const totalTransferenciaCortes = citas
    .filter(cita => cita.typePay === 'Transferencia')
    .reduce((acc, cita) => acc + (parseInt(cita.cutPrice) || 0), 0);

  const totalEfectivoExtras = citas
    .filter(cita => cita.typePay === 'Efectivo')
    .reduce((acc, cita) => acc + (parseInt(cita.extraPrice) || 0), 0);

  const totalTransferenciaExtras = citas
    .filter(cita => cita.typePay === 'Transferencia')
    .reduce((acc, cita) => acc + (parseInt(cita.extraPrice) || 0), 0);

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <MoonLoader size={60} color="#36d7b7" />
        </div>
      )}
      <h1>Avance de {userName}</h1>
      {citas.length === 0 ? (
        <p>No tienes citas registradas.</p>
      ) : (
        <table className="citas-table">
          <thead>
            <tr>
              <th>Correo</th>
              <th>Fecha</th>
              <th>Corte</th>
              <th>Precio Corte</th>
              <th>Extra</th>
              <th>Precio Extra</th>
            </tr>
          </thead>
          <tbody>
            {citas.map(cita => (
              <tr key={cita.id}>
                <td>{cita.userEmail}</td>
                <td>{cita.date}</td>
                <td>{cita.cut}</td>
                <td>{cita.cutPrice}</td>
                <td className={!cita.extra ? 'no-extra' : ''}>{cita.extra || 'Sin extra'}</td>
                <td>{cita.extraPrice || 'N/A'}</td>
              </tr>
            ))}
            <tr className="total-row">
              <td colSpan="3">Total extra separado</td>
              <td>
                E: {totalEfectivoCortes}, T: {totalTransferenciaCortes}
              </td>
              <td colSpan="2">
                E: {totalEfectivoExtras}, T: {totalTransferenciaExtras}
              </td>
            </tr>
            <tr className="total-row">
              <td colSpan="3">Total Final</td>
              <td>
                E: {totalEfectivoCortes+totalEfectivoExtras}, T: {totalTransferenciaCortes+totalTransferenciaExtras}
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button className="back-button" onClick={() => navigate('/user')}>
        Volver
      </button>
    </div>
  );
};

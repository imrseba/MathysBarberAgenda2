import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { MoonLoader } from 'react-spinners';
import { db } from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import '../styles/AdminAvance.css';

export const AdminAvance = () => {
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState([]);
  const navigate = useNavigate();

  const fetchCitas = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'citas'));
      const citasData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const sortedCitas = citasData.sort((a, b) => a.userEmail.localeCompare(b.userEmail));
      setCitas(sortedCitas);
    } catch (error) {
      console.error('Error al obtener las citas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitas();
  }, []);

  const citasPorCorreo = citas.reduce((acc, cita) => {
    if (!acc[cita.userEmail]) {
      acc[cita.userEmail] = [];
    }
    acc[cita.userEmail].push(cita);
    return acc;
  }, {});

  return (
    <div>
      {loading && (
        <div className="loading-overlay">
          <MoonLoader size={60} color="#36d7b7" />
        </div>
      )}
      <h1>Avance</h1>
      {citas.length === 0 ? (
        <p>No hay citas registradas.</p>
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
            {Object.entries(citasPorCorreo).map(([correo, citas]) => {
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
                <React.Fragment key={correo}>
                  {citas.map(cita => (
                    <tr key={cita.id}>
                      <td>{cita.userEmail.split('@')[0]}</td>
                      <td>{cita.date}</td>
                      <td>{cita.cut}</td>
                      <td>{cita.cutPrice}</td>
                      <td className={!cita.extra ? 'no-extra' : ''}>{cita.extra || 'Sin extra'}</td>
                      <td>{cita.extraPrice || 'N/A'}</td>
                    </tr>
                  ))}
                  <tr className="total-row">
                    <td colSpan="3">Total para {correo.split('@')[0]}</td>
                    <td>
                      E: {totalEfectivoCortes}, T: {totalTransferenciaCortes}
                    </td>
                    <td colSpan="2">
                      E: {totalEfectivoExtras}, T: {totalTransferenciaExtras}
                    </td>
                  </tr>
                  <tr className="total-row">
                    <td colSpan="3">Total Final {correo.split('@')[0]}</td>
                    <td>
                      E: {totalEfectivoCortes+totalEfectivoExtras}, T: {totalTransferenciaCortes+totalTransferenciaExtras}
                    </td>
                  </tr>
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}
      <button className="back-button" onClick={() => navigate('/user')}>
        Volver
      </button>
    </div>
  );
};

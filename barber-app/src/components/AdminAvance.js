import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { MoonLoader } from 'react-spinners';
import { db } from '../firebaseConfig';
import '../styles/AdminAvance.css';

export const AdminAvance = () => {
  const [loading, setLoading] = useState(false);
  const [citas, setCitas] = useState([]);

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
            {Object.entries(citasPorCorreo).map(([correo, citas]) => (
              <React.Fragment key={correo}>
                {/* Filas de citas para este correo */}
                {citas.map(cita => (
                  <tr key={cita.id}>
                    <td>{cita.userEmail}</td>
                    <td>{cita.date}</td>
                    <td>{cita.cut}</td>
                    <td>{cita.cutPrice}</td>
                    {/* Estilo condicional para la celda de extra */}
                    <td className={!cita.extra ? 'no-extra' : ''}>{cita.extra || 'Sin extra'}</td>
                    <td>{cita.extraPrice || 'N/A'}</td>
                  </tr>
                ))}
                {/* Fila de totales para este correo */}
                <tr className="total-row">
                  <td colSpan="3">Total para {correo}</td>
                  <td>
                    {citas
                      .reduce((acc, cita) => acc + (parseInt(cita.cutPrice) || 0), 0)}
                  </td>
                  <td colSpan="2">
                    {citas
                      .reduce((acc, cita) => acc + (parseInt(cita.extraPrice) || 0), 0)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

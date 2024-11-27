import React, { useState } from 'react';
import { UserPage } from './UserPage';
import { collection, getDocs, deleteDoc as deleteFirestoreDoc, doc as firestoreDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { MoonLoader } from 'react-spinners';
import '../styles/AdminPage.css';
import { jsPDF } from 'jspdf';

export const AdminPage = () => {
  const [loading, setLoading] = useState(false);
  const date = useState(new Date().toISOString().split('T')[0]);

  const handleGeneratePDF = async () => {
    const isConfirmed = window.confirm('¿Estás seguro de que quieres ver la semana y generar el PDF?');

    if (!isConfirmed) {
      return; 
    }

    setLoading(true);
    try {

      const querySnapshot = await getDocs(collection(db, 'citas'));
      const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


      const groupedAppointments = appointments.reduce((acc, appointment) => {
        const { userEmail, cut, cutPrice, extra, extraPrice } = appointment;
        if (!acc[userEmail]) {
          acc[userEmail] = [];
        }
        acc[userEmail].push({
          cut,
          cutPrice,
          extra,
          extraPrice,
        });
        return acc;
      }, {});


      const result = Object.keys(groupedAppointments).map(email => {
        const appointmentsList = groupedAppointments[email];
        const total = appointmentsList.reduce((sum, appointment) => {
          return sum + appointment.cutPrice + (appointment.extraPrice || 0);
        }, 0);

        return {
          title: email,
          lista: appointmentsList,
          total,
        };
      });

      const pdfDoc = new jsPDF();
      const pageWidth = pdfDoc.internal.pageSize.width;

      result.forEach((emailData, index) => {
        pdfDoc.setFontSize(16);
        const titleWidth = pdfDoc.getStringUnitWidth(emailData.title) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
        const titleX = (pageWidth - titleWidth) / 2;
        pdfDoc.text(emailData.title, titleX, 20 + (index * 40));

        let yPosition = 30 + (index * 40);

        emailData.lista.forEach((appointment, idx) => {
          pdfDoc.setFontSize(12);

          const cutText = `Corte: ${appointment.cut}`;
          const cutTextWidth = pdfDoc.getStringUnitWidth(cutText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
          const cutTextX = (pageWidth - cutTextWidth) / 2;
          yPosition += 10;

          pdfDoc.text(cutText, cutTextX, yPosition);

          const cutPriceText = `Precio del corte: ${appointment.cutPrice}`;
          const cutPriceTextWidth = pdfDoc.getStringUnitWidth(cutPriceText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
          const cutPriceTextX = (pageWidth - cutPriceTextWidth) / 2;
          yPosition += 5;

          pdfDoc.text(cutPriceText, cutPriceTextX, yPosition);

          if (appointment.extra) {
            const extraText = `Extra: ${appointment.extra}`;
            const extraTextWidth = pdfDoc.getStringUnitWidth(extraText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
            const extraTextX = (pageWidth - extraTextWidth) / 2;
            yPosition += 10;

            pdfDoc.text(extraText, extraTextX, yPosition);
          }

          if (appointment.extraPrice) {
            const extraPriceText = `Precio extra: ${appointment.extraPrice}`;
            const extraPriceTextWidth = pdfDoc.getStringUnitWidth(extraPriceText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
            const extraPriceTextX = (pageWidth - extraPriceTextWidth) / 2;
            yPosition += 5;

            pdfDoc.text(extraPriceText, extraPriceTextX, yPosition);
          }

          if(!appointment.extraPrice && !appointment.extra){
            const extraText = `No tiene ningun extra agregado este corte`;
            const extraPriceTextWidth = pdfDoc.getStringUnitWidth(extraText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
            const extraPriceTextX = (pageWidth - extraPriceTextWidth) / 2;
            yPosition += 5;
            pdfDoc.text(extraText, extraPriceTextX, yPosition);
          }
          pdfDoc.text('---------------------------------------', 80, yPosition + 5);
        });

        const totalText = `Total: ${emailData.total}`;
        const totalTextWidth = pdfDoc.getStringUnitWidth(totalText) * pdfDoc.internal.getFontSize() / pdfDoc.internal.scaleFactor;
        const totalTextX = (pageWidth - totalTextWidth) / 2;
        yPosition += 10;

        pdfDoc.setFontSize(14);
        pdfDoc.text(totalText, totalTextX, yPosition);

        if (index < result.length - 1) {
          pdfDoc.addPage();
        }
      });


      pdfDoc.save(`Agenda Dia ${date[0]}.pdf`);

      appointments.forEach(async (appointment) => {
        const appointmentDocRef = firestoreDoc(db, 'citas', appointment.id);
        await deleteFirestoreDoc(appointmentDocRef);
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching or deleting appointments:", error);
      setLoading(false);
    }
  };

  return (
    <div className='page-container'>
      {loading && (
        <div className="loading-overlay">
          <MoonLoader size={60} color="#36d7b7" />
        </div>
      )}
      <button onClick={handleGeneratePDF}>Ver Semana</button>
      <UserPage />
    </div>
  );
};

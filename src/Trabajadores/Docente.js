import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import '../App.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ListaDocentes = () => {
    const [docentes, setDocentes] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiBD.php');
                const data = await response.json();
                setDocentes(data);
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 1000);
        return () => clearInterval(interval);
    }, []);

    const chartData = {
        labels: docentes.map((docentess) => `ID: ${docentess.id}`),
        datasets: [
            {
                label: 'IDs de Docentes',
                data: docentes.map((docente) => docente.id),
                backgroundColor: docentes.map((_, index) => `hsl(${index * 360 / docentes.length}, 70%, 60%)`),  // Colores distintos para cada barra
                borderColor: docentes.map((_, index) => `hsl(${index * 360 / docentes.length}, 70%, 50%)`),
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="container mt-4">
            <h1 className='App App-link'>DOCENTES INGENIERÍA INFORMÁTICA TESSFP</h1>
            <div className="row">
                {docentes.map((docente, index) => (
                    <div key={index} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">
                                    Clave ISSEMYN: <strong>{docente.issemyn}</strong>
                                </h5>
                                <p className="card-text">
                                    <strong>ID:</strong> {docente.id}
                                </p>
                                <p className="card-text">
                                    <strong>Nombre:</strong> {docente.nombre}
                                </p>
                                <p className="card-text">
                                    <strong>Teléfono:</strong> {docente.telefono}
                                </p>
                                <p className="card-text">
                                    <strong>Sexo:</strong> {docente.sexo}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Gráfica de barras al final */}
            <div className="row mt-4">
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Gráfica de IDs de Docentes</h5>
                            <Bar data={chartData} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListaDocentes;

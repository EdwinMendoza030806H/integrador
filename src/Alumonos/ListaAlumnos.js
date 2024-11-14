import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import './ListaAlumnos.css';

const ListaAlumnos = () => {
    const [alumnos, setAlumnos] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://alex.starcode.com.mx/apiAlumnos.php');
                if (!response.ok) {
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                const data = await response.json();
                setAlumnos(data);
            } catch (error) {
                console.error("Fetch error:", error.message);
            }
        };

        fetchData();
        const intervalId = setInterval(fetchData, 5000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h1 className="App App-link">CALIFICACIONES POR DOCENTE</h1>

            <div className="alumnos-container">
                {alumnos.map((alumno) => {
                    const practicas = Object.values(alumno.practicas).map(Number);
                    const promedio = practicas.reduce((a, b) => a + b, 0) / practicas.length;
                    const aprobado = promedio >= 7;

                    const barData = {
                        labels: ['Promedio General'],
                        datasets: [
                            {
                                label: 'Promedio General',
                                data: [promedio],
                                backgroundColor: aprobado ? 'green' : 'red',
                                borderWidth: 1,
                                borderColor: '#333',
                            },
                        ],
                    };

                    const barOptions = {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                            },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 10,
                            },
                        },
                    };

                    return (
                        <div key={alumno.id} className="alumno-card">
                            <h2>Datos del Docente</h2>
                            <table className="tabla-alumno">
                                <tbody>
                                    <tr>
                                        <td><strong>ID:</strong></td>
                                        <td>{alumno.id}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cuenta:</strong></td>
                                        <td>{alumno.cuenta}</td>
                                    </tr>
                                    <tr>
                                        <td><strong>Nombre:</strong></td>
                                        <td>{alumno.nombre}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <h3>Calificaciones de Prácticas</h3>
                            <div className="tabla-practicas-container">
                                <table className="tabla-practicas">
                                    <thead>
                                        <tr>
                                            {Object.keys(alumno.practicas).map((practica) => (
                                                <th key={practica}>{practica}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            {Object.values(alumno.practicas).map((calificacion, index) => (
                                                <td key={index}>{calificacion}</td>
                                            ))}
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grafica-promedio">
                                <Bar data={barData} options={barOptions} width={250} height={150} />
                            </div>
                            <p>Promedio General: {promedio.toFixed(2)}</p>
                            <div className={`status ${aprobado ? 'aprobado' : 'reprobado'}`}>
                                {aprobado ? 'Aprobado' : 'Reprobado'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ListaAlumnos;

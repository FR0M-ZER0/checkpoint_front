import React from 'react';
import { Bar } from 'react-chartjs-2';
import { HorasExtrasAcumuladasDTO } from '../types/HorasExtrasTypes';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface HorasExtrasChartProps {
    data: HorasExtrasAcumuladasDTO[];
}

const HorasExtrasChart: React.FC<HorasExtrasChartProps> = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.colaboradorNome),
        datasets: [
            {
                label: 'Horas Extras Acumuladas',
                data: data.map(item => item.totalHoras),
                backgroundColor: 'rgba(59, 130, 246, 0.7)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: 'Horas Extras por Colaborador',
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        label += context.parsed.y.toFixed(2) + ' horas';
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Horas'
                }
            }
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="h-96">
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default HorasExtrasChart;
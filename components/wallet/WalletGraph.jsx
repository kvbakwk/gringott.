import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function WalletGraph({ wallet, good, slug }) {

    const [datasets, setDatasets] = useState([{
        label: '2000',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: '#e8b219',
        backgroundColor: '#e8b219',
        tension: 0
    }])

    useEffect(() => {
        const shadows = ['ff', 'bb', '88', '55', '33']
        const transactions = wallet.transactions
        let yearsIs = []
        const years = transactions.filter((transaction) => {
            if (!yearsIs.includes(new Date(transaction.date).getFullYear())) {
                yearsIs.push(new Date(transaction.date).getFullYear())
                return true
            } else
                return false
        })
        let dataset = []

        years.map((year) => {
            let data = []

            for (let i = 0; i < 12; i++) {
                let balance = wallet.balance
                transactions.filter(trans1 => new Date(trans1.date).getTime() > new Date(`${new Date(year.date).getFullYear()}-${i + 1}-31 23:59:59.99`).getTime()).map(trans2 => {
                    if (trans2.deposit)
                        balance -= trans2.amount
                    else
                        balance += trans2.amount
                })

                data.push(parseFloat(balance))
            }

            dataset.push({
                label: new Date(year.date).getFullYear().toString(),
                data: data,
                borderColor: '#e8b219' + shadows[years.indexOf(year)],
                backgroundColor: '#e8b219' + shadows[years.indexOf(year)],
                tension: 0.1
            })
        })
        setDatasets(dataset)
    }, [slug])

    return (
        <Line
            options={{
                responsive: true,
                plugins: {
                    legend: {
                        position: 'center'
                    }
                },
                maintainAspectRatio: false
            }}
            data={{
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: datasets,
            }}
        />
    )
}
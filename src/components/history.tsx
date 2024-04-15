import axios from "axios";
import { IHistory, IOption } from "../interfaces";
import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions,
    ChartData
} from 'chart.js';
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

export default function History({ option, question }: IOption){
    
    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [data, setData] = useState<ChartData<"line">>({
        labels: ["null"],
        datasets: []
    });
    const [chartOption, setChartOption] = useState<ChartOptions<"line">>({
        maintainAspectRatio: false,
        responsive: true,
        devicePixelRatio: 2,
    });

    useEffect(() => {
        const fetchHistory = async () => {
            let request =
                "?history&population=" +
                option?.popdrop +
                "&mode=" +
                option?.modedrop +
                "&level=" +
                option?.leveldrop +
                "&q=" +
                question?.substring(0, 3) +
                "&subject=" +
                option?.subdrop +
                "&provider=University of Northumbria at Newcastle";

            let response = await api.get<IHistory[]>(request);

            setData({
                labels: response.data.map((data) => data.year),
                datasets: [
                    {
                        label: "Positivity Measure",
                        data: response.data.map((data) => data.positivity),
                        borderColor: 'rgb(75, 192, 192)',
                        fill: false,
                        pointRadius: 5,
                        pointBackgroundColor: 'rgb(75, 192, 192)'
                    },
                    {
                        label: "NSS Benchmark",
                        data: response.data.map((data) => data.benchmark),
                        borderColor: 'rgb(248,113,113)',
                        fill: false,
                        pointRadius: 6,
                        pointBackgroundColor: 'rgb(248,113,113)',
                        pointStyle: "triangle"
                    }
                ]
            })

            setChartOption({
                maintainAspectRatio: false,
                responsive: true,
                devicePixelRatio: 2,
                plugins:{
                    legend: {
                        display: true,
                        labels: {
                            font: {
                                size: 16,
                            },
                            boxWidth: 10,
                            boxHeight: 10,
                            color: "black",
                            usePointStyle: true
                        },
                        onClick: function () {},
                        position: "bottom",
                    },
                    title: {
                        display: true,
                        text: "History Data for " + question?.substring(0,3),
                        font: {
                            size: 18,
                        },
                        padding: 10,
                    },
                    datalabels: {
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            title: () => "",
                            label: function (context) {
                                console.log(context);
                                if(context.dataset.label === "Positivity Measure")
                                {
                                    return `We achieved ${context.formattedValue}% positive measure on ${context.label}`
                                }
                                else if(context.dataset.label === "NSS Benchmark")
                                {
                                    return `We achieved ${context.formattedValue}% benchmark score on ${context.label}`
                                }
                            },
                        },
                        bodyFont:{
                            size: 18
                        },
                        padding: 10,
                        animation: {
                            duration: 100
                        },
                        displayColors: false
                    }
                },
                scales:{
                    x: {
                        offset: true
                    },
                    y: {
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 10
                        }
                    }
                },
                layout:{
                    padding: 10
                }
            })
        }
        fetchHistory();
    }, [question])

    return (
        <Line data={data} options={chartOption} />
    )
}
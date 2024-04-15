import { useEffect, useState } from "react";
import { ICompare } from "../interfaces";
import { ChartData, ChartOptions } from "chart.js";
import { Line } from "react-chartjs-2";

interface Props {
    comparison: ICompare 
    mode: string
}

export default function CompareLine({comparison, mode}:Props){
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
        setData({
            labels: comparison.result.map((data) => data.qid),
            datasets: [
                {
                    label: comparison.provider_x,
                    data: (mode === "positivity") ? comparison.result.map((data) => data.positive_x) : comparison.result.map((data) => data.benchmark_x),
                    borderColor: 'rgb(75, 192, 192)',
                    fill: false,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgb(75, 192, 192)'
                },
                {
                    label: comparison.provider_y,
                    data: (mode === "positivity") ? comparison.result.map((data) => data.positive_y) : comparison.result.map((data) => data.benchmark_y),
                    borderColor: 'rgb(248,113,113)',
                    fill: false,
                    pointRadius: 7,
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
                        usePointStyle: true,
                        padding: 20
                    },
                    onClick: function () {},
                    position: "bottom"
                },
                title: {
                    display: true,
                    text: comparison.result.length !== 0 ? "Comparison between "+comparison.provider_x+" ("+comparison.year_x+")"+" and "+comparison.provider_y+" ("+comparison.year_y+")"
                            : "Press 'Start Comparing' to start the comparison between two providers.",
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
                        title: (context) => {
                            return context[0].label+": "+comparison.result[context[0].dataIndex].qtext
                        },
                    },
                    bodyFont:{
                        size: 15
                    },
                    padding: 10,
                    animation: {
                        duration: 100
                    },
                    titleFont: {
                        size: 16
                    },
                    boxPadding: 2
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
                padding: 18
            }
        })
    }, [comparison])

    return(
        <Line data={data} options={chartOption} />
    )
}
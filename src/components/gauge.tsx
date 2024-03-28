import axios from "axios";
import { IGauge, IOption } from "../interfaces";
import { useEffect, useRef, useState } from "react";
import {ChartData, ChartOptions, Plugin} from "chart.js";
import { Doughnut } from "react-chartjs-2";

export default function Gauge({question, option}: IOption){

    const api = axios.create({
        baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
    });

    const [positive, setPositive] = useState<ChartData<"doughnut">>({
        labels: [],
        datasets: [],
    })

    const [benchmark, setBenchmark] = useState<ChartData<"doughnut">>({
        labels:[],
        datasets:[]
    })

    const [positiveOption, setPositiveOption] = useState<ChartOptions<"doughnut">>({
        maintainAspectRatio: false,
        responsive: true,
        devicePixelRatio: 2,
    });

    const [benchmarkOption, setBenchmarkOption] = useState<ChartOptions<"doughnut">>({
        maintainAspectRatio: false,
        responsive: true,
        devicePixelRatio: 2,
    });

    const gaugeRef = useRef<IGauge>({positivity: 0, benchmark: 0});

    const positiveLabel: Plugin<"doughnut"> = {
        id: "positiveLabel",
        afterDatasetDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            ctx.font = "22px sans-serif";
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(gaugeRef.current.positivity + "%", xCoor, yCoor-5);
        },
    };

    const benchmarkLabel: Plugin<"doughnut"> = {
        id: "bnenchmarkLabel",
        afterDatasetDraw(chart) {
            const { ctx } = chart;
            ctx.save();
            const xCoor = chart.getDatasetMeta(0).data[0].x;
            const yCoor = chart.getDatasetMeta(0).data[0].y;
            ctx.font = "22px sans-serif";
            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(gaugeRef.current.benchmark + "%", xCoor, yCoor-5);
        },
    };

    useEffect(() => {
        const fetchGauge = async () => {
            let request =
               "?gauge&population=" +
               option?.popdrop +
               "&mode=" +
               option?.modedrop +
               "&level=" +
               option?.leveldrop +
               "&year=" +
               option?.yeardrop +
               "&subject=" +
               option?.subdrop +
               "&q=" +
               question?.substring(0, 3);

            let response = await api.get<IGauge>(request);

            gaugeRef.current = response.data;

            setPositive({
                labels: ["Positivity Measure"],
                datasets: [
                    {
                        label: "Positivity Measure",
                        data: [response.data.positivity, 100-response.data.positivity],
                        backgroundColor: ["rgb(74,222,128)", "rgb(178,190,181)"],
                        circumference: 180,
                        rotation: 270,
                    }
                ]
            })

            setBenchmark({
                labels: ["Benchmark"],
                datasets: [
                    {
                        label: "Benchmark",
                        data: [response.data.benchmark, 100-response.data.benchmark],
                        backgroundColor: ["rgb(74,222,128)", "rgb(178,190,181)"],
                        circumference: 180,
                        rotation: 270,
                    }
                ]
            })

            setPositiveOption({
                maintainAspectRatio: false,
                responsive: true,
                devicePixelRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text:
                            "Positivity Measure for " +
                            question?.substring(0, 3) +
                            " (" +
                            option?.yeardrop +
                            ")",
                        font: {
                            size: 18,
                        },
                        padding: 10
                    },
                    datalabels: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                layout:{
                    padding: 10
                }
            })

            setBenchmarkOption({
                maintainAspectRatio: false,
                responsive: true,
                devicePixelRatio: 2,
                plugins: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text:
                            "NSS Benchmark for " +
                            question?.substring(0, 3) +
                            " (" +
                            option?.yeardrop +
                            ")",
                        font: {
                            size: 18,
                        },
                        padding: 10
                    },
                    datalabels: {
                        display: false,
                    },
                    tooltip: {
                        enabled: false
                    }
                },
                layout:{
                    padding: 10
                }
            })
        };
        fetchGauge();
    },[question])

    return(
        <div className="flex flex-col h-full space-y-2">
            <div className="border rounded-md h-[171px]">
                <Doughnut data={positive} options={positiveOption} plugins={[positiveLabel]} />
            </div>
            <div className="border rounded-md h-[171px]">
                <Doughnut data={benchmark} options={benchmarkOption} plugins={[benchmarkLabel]} />
            </div>
        </div>
    )
}
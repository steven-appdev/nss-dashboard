import axios from "axios";
import { useEffect, useState } from "react";
import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   ChartDataset,
   ChartData,
   ChartOptions,
   LegendItem
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { IDataFilter, IQuartile } from "../interfaces";

ChartJS.register(
   ArcElement,
   Tooltip,
   Legend,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   ChartDataLabels,
);

export default function Difference({
   question,
   level,
   mode,
   population,
}: IDataFilter) {

   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<ChartDataset<"bar">[]>([]);
   const [option, setOption] = useState<ChartOptions<"bar">>({
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2
   });
   
   useEffect(() => {
      const fetchQuartile = async () => {
         let request =
            "?quartdiff&population=" +
            population +
            "&mode=" +
            mode +
            "&level=" +
            level +
            "&q=" +
            question;

         console.log(request);
         let response = await api.get<IQuartile>(request);

         const colorCode = ["rgb(74,222,128","rgb(253,224,71","rgb(254,202,202","rgb(248,113,113"]
         const retrievedData: ChartDataset<"bar">[] =
            response.data.differences.map((diff) => ({
               label: diff.label,
               data: [diff.data[0]],
               backgroundColor: diff.current
                  ? "rgb(71,85,105)"
                  : colorCode[diff.colorCode]+",0.4)"
               ,
            }));
         setData(retrievedData);

         const bar_option: ChartOptions<"bar"> = {
            maintainAspectRatio: false,
            devicePixelRatio: 2,
            indexAxis: "y",
            responsive: true,
            plugins: {
               legend: {
                  display: true,
                  labels:{
                     generateLabels: (chart): LegendItem[] => {
                        const datasets = retrievedData;
                        return datasets.map((item)=>({
                           text: String(item.label)+" ("+String(item.data)+"%)",
                           fillStyle: String(item.backgroundColor),
                        }))
                     },
                     font:{
                        size: 16
                     },
                     padding: 30,
                     boxWidth: 18
                  },
                  position: "bottom"
               },
               title: {
                  display: true,
                  text: "Positive Measure for "+question,
                  font: {
                     size: 18
                  }
               },
               datalabels: {
                  display: false
               },
               tooltip: {
                  callbacks: {
                     title : () => ""
                  },
                  position: "average",
                  bodyFont: {
                     size: 16,
                     weight: "bold"
                  },
                  padding: 10,
                  animation: {
                     duration: 300
                  },
                  displayColors: false
               }
            },
            scales: {
               x: {
                  stacked: true,
               },
               y: {
                  stacked: true,
                  ticks: {
                     display: false,
                  }
               },
            },
         };
         setOption(bar_option);
      };
      fetchQuartile();
   }, [question]);

   const bar_data: ChartData<"bar"> = {
      labels: ["No label"],
      datasets: data,
   };

   return (
      <Bar data={bar_data} options={option} />
   );
}

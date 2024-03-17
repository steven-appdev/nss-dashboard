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
   ChartOptions
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Doughnut, Bar } from "react-chartjs-2";
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
   const dough_data = {
      labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
      datasets: [
         {
            label: "# of Votes",
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
               "rgba(255, 99, 132, 0.2)",
               "rgba(54, 162, 235, 0.2)",
               "rgba(255, 206, 86, 0.2)",
               "rgba(75, 192, 192, 0.2)",
               "rgba(153, 102, 255, 0.2)",
               "rgba(255, 159, 64, 0.2)",
            ],
            borderColor: [
               "rgba(255, 99, 132, 1)",
               "rgba(54, 162, 235, 1)",
               "rgba(255, 206, 86, 1)",
               "rgba(75, 192, 192, 1)",
               "rgba(153, 102, 255, 1)",
               "rgba(255, 159, 64, 1)",
            ],
            borderWidth: 1,
         },
      ],
   };

   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [quartile, setQuartile] = useState<IQuartile>();
   const [data, setData] = useState<ChartDataset<"bar">[]>([]);
   
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

         let response = await api.get<IQuartile>(request);
         setQuartile(response.data);

         const retrievedData: ChartDataset<"bar">[] =
            response.data.differences.map((diff) => ({
               label: diff.label,
               data: [diff.data[0]],
               backgroundColor: diff.current
                  ? "rgb(71,85,105)"
                  : "rgb(146, 152, 161)",
               borderColor: "rgb(0,0,0)",
               borderWidth: 1,
               borderSkipped: "end"
               ,
            }));
         setData(retrievedData);
      };
      fetchQuartile();
      console.log(data);
   }, [question]);

   const bar_data: ChartData<"bar"> = {
      labels: [1],
      datasets: data,
   };

   const bar_option: ChartOptions<"bar"> = {
      maintainAspectRatio: false,
      indexAxis: "y",
      responsive: true,
      plugins: {
         legend: {
            display: false
         },
         title: {
            display: true,
            text: "Chart.js Horizontal Bar Chart",
         },
         datalabels: {
            display: true,
            color: "white"
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

   return (
      <div className="mt-10 mx-10 h-[400px]">
         <div className="flex flex-row h-full">
            <div className="border rounded-md flex-1 p-4 mr-1">
               <Doughnut
                  data={dough_data}
                  options={{
                     maintainAspectRatio: false,
                     responsive: true,
                     plugins: { legend: { display: false } },
                  }}
               />
            </div>
            <div className="border rounded-md flex-1 p-4 ml-1">
               <Bar data={bar_data} options={bar_option} />
            </div>
         </div>
      </div>
   );
}

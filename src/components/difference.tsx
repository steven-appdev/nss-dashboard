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

   const [max, setMax] = useState<number>(99);
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

         let response = await api.get<IQuartile>(request);
         setMax(response.data.resp_count);
         const colorCode = ["rgb(74,222,128","rgb(253,224,71","rgb(254,202,202","rgb(248,113,113"]
         const retrievedData: ChartDataset<"bar">[] =
            response.data.differences.map((diff) => ({
               label: diff.label,
               data: [diff.abs_data[0]],
               backgroundColor: diff.current
                  ? "rgb(71,85,105)"
                  : colorCode[diff.colorCode]+")"
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
                     generateLabels: (): LegendItem[] => {
                        const datasets = retrievedData;
                        return datasets.map((item)=>({
                           text: String(item.label),
                           fillStyle: String(item.backgroundColor),
                        }))
                     },
                     font:{
                        size: 16
                     },
                     boxWidth: 18,
                     boxHeight: 18,
                     padding: 18
                  },
                  onClick: function(event, legendItem) {},
                  position: "bottom"
               },
               title: {
                  display: true,
                  text: "Positive Reponses for "+question,
                  font: {
                     size: 20
                  },
                  padding: 15
               },
               datalabels: {
                  display: false
               },
               tooltip: {
                  callbacks: {
                     title : () => "",
                     label: function(context){
                        if(context.datasetIndex == 0)
                        {
                           return `You are currently at ${context.dataset.label} with ${context.formattedValue} positive responses!`
                        }
                        else
                        {
                           var i = context.datasetIndex;
                           var total = 0;
                           while(i>=1){
                              total += response.data.differences[i].abs_data[0]
                              i--;
                           }
                           return `${total} more positive responses until ${context.dataset.label}!`
                        }
                     }
                  },
                  position: "average",
                  bodyFont: {
                     size: 20
                  },
                  padding: 10,
                  animation: {
                     duration: 200
                  },
                  displayColors: false
               }
            },
            scales: {
               x: {
                  stacked: true,
                  suggestedMax: response.data.resp_count
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

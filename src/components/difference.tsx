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
   LegendItem,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Bar } from "react-chartjs-2";
import { IDataFilter, IOption, IQuartile } from "../interfaces";

ChartJS.register(
   ArcElement,
   Tooltip,
   Legend,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   ChartDataLabels
);

export default function Difference({ option, question }: IOption) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<ChartDataset<"bar">[]>([]);
   const [chartOption, setChartOption] = useState<ChartOptions<"bar">>({
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2,
   });

   useEffect(() => {
      const fetchQuartile = async () => {
         let request =
            "?quartdiff&population=" +
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

         let response = await api.get<IQuartile>(request);
         const colorCode = [
            "rgb(74,222,128",
            "rgb(253,224,71",
            "rgb(254,202,202",
            "rgb(248,113,113",
         ];
         const retrievedData: ChartDataset<"bar">[] = response.data
            ? response.data.differences.map((diff) => ({
                 label: diff.label,
                 data: [diff.abs_data[0]],
                 backgroundColor: diff.current
                    ? "rgb(71,85,105)"
                    : colorCode[diff.colorCode] + ")",
              }))
            : [
                 {
                    label: "No data available",
                    data: [0],
                    backgroundColor: "rgb(0,0,0)",
                 },
              ];
         setData(retrievedData);

         const bar_option: ChartOptions<"bar"> = {
            maintainAspectRatio: false,
            devicePixelRatio: 2,
            indexAxis: "y",
            responsive: true,
            plugins: {
               legend: {
                  display: true,
                  labels: {
                     font: {
                        size: 16,
                     },
                     boxWidth: 18,
                     boxHeight: 18,
                     padding: 18,
                     color: "black",
                  },
                  onClick: function () {},
                  position: "bottom",
               },
               title: {
                  display: true,
                  text: "Positive Reponses for " + question?.substring(0,3)  + " (" + option?.yeardrop +")",
                  font: {
                     size: 20,
                  },
                  padding: 15,
               },
               datalabels: {
                  display: false,
               },
               tooltip: {
                  callbacks: {
                     title: () => "",
                     label: function (context) {
                        if (context.datasetIndex == 0 && response.data) {
                           return `You are currently at ${context.dataset.label} with ${context.formattedValue} positive responses!`;
                        } else {
                           var i = context.datasetIndex;
                           var total = 0;
                           while (i >= 1) {
                              total += response.data.differences[i].abs_data[0];
                              i--;
                           }
                           return `${total} more positive responses until ${context.dataset.label}!`;
                        }
                     },
                  },
                  position: "average",
                  bodyFont: {
                     size: 18,
                  },
                  padding: 10,
                  animation: {
                     duration: 100,
                  },
                  displayColors: false,
               },
            },
            scales: {
               x: {
                  stacked: true,
                  suggestedMax: (response.data)?response.data.resp_count:0,
               },
               y: {
                  stacked: true,
                  ticks: {
                     display: false,
                  },
               },
            },
         };
         setChartOption(bar_option);
      };
      fetchQuartile();
   }, [question]);

   const bar_data: ChartData<"bar"> = {
      labels: ["No label"],
      datasets: data,
   };

   return <Bar data={bar_data} options={chartOption} />;
}

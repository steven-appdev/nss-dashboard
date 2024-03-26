import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
   ChartOptions,
   ChartData,
   Plugin
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IDataFilter, IRespRate } from "../interfaces";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RespRate({
   question,
   level,
   mode,
   population,
}: IDataFilter) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<ChartData<"doughnut">>({
      labels: [],
      datasets: [],
   });
   const [option, setOption] = useState<ChartOptions<"doughnut">>({
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2,
   });
   const resprateRef = useRef<number>(0);
   const doughnutLabel:Plugin<"doughnut"> = ({
      id: "doughnutLabel",
      afterDatasetDraw(chart){
         const {ctx} = chart;
         ctx.save();
         const xCoor = chart.getDatasetMeta(0).data[0].x;
         const yCoor = chart.getDatasetMeta(0).data[0].y;
         ctx.font = '28px sans-serif';
         ctx.fillStyle = 'rgb(0, 0, 0)';
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         ctx.fillText(resprateRef.current+"%", xCoor, yCoor);
      },
   })

   useEffect(() => {
      const fetchRespRate = async () => {
         let request =
            "?resprate&population=" +
            population +
            "&mode=" +
            mode +
            "&level=" +
            level +
            "&q=" +
            question;

         let response = await api.get<IRespRate>(request);

         const colorCode = [
            "rgb(74,222,128)",
            "rgb(248,113,113)",
            "rgb(178,190,181)",
         ];

         const data: ChartData<"doughnut"> = {
            labels: response.data.detail.map((item) => item.label),
            datasets: [
               {
                  label: "Value",
                  data: response.data.detail.map((item) => item.data),
                  backgroundColor: response.data.detail.map(
                     (item) => colorCode[item.colorCode]
                  ),
               },
            ],
         };
         setData(data);

         const doughnutOption: ChartOptions<"doughnut"> = {
            maintainAspectRatio: false,
            responsive: true,
            devicePixelRatio: 2,
            plugins: {
               legend: {
                  position: "bottom",
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
               },
               title: {
                  display: true,
                  text: "Response Rate for " + question,
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
                     label: function(context){
                        if(context.label === "Responded"){
                           return `${context.formattedValue} student(s) have responded to this question.`
                        } else if(context.label === "Not Applicable"){
                           return `${context.formattedValue} student(s) have responded with "Not Applicable".`
                        } else if(context.label === "Not Participate"){
                           return `${context.formattedValue} student(s) did not participate in this question.`
                        }
                     }
                  },
                  bodyFont: {
                     size: 18,
                  },
                  padding: 10,
                  animation: {
                     duration: 100,
                  },
                  displayColors: false,
               }
            },
         };
         setOption(doughnutOption);
         resprateRef.current = response.data.resp_rate;
      };
      fetchRespRate();
   }, [question, population, mode, level]);
   return <Doughnut data={data} options={option} plugins={[doughnutLabel]}/>;
}

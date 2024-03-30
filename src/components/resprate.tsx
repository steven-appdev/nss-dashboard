import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
   ChartOptions,
   ChartData,
   Plugin,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { IOption, IRespRate } from "../interfaces";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RespRate({ question, option }: IOption) {
   const api = axios.create({
      baseURL: "https://w20003691.nuwebspace.co.uk/api/access",
   });

   const [data, setData] = useState<ChartData<"doughnut">>({
      labels: [],
      datasets: [],
   });
   const [chartOption, setChartOption] = useState<ChartOptions<"doughnut">>({
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2,
   });
   const resprateRef = useRef<number>(0);
   const doughnutLabel: Plugin<"doughnut"> = {
      id: "doughnutLabel",
      afterDatasetDraw(chart) {
         const { ctx } = chart;
         ctx.save();
         const xCoor = chart.getDatasetMeta(0).data[0].x;
         const yCoor = chart.getDatasetMeta(0).data[0].y;
         ctx.font = "28px sans-serif";
         ctx.fillStyle = "rgb(0, 0, 0)";
         ctx.textAlign = "center";
         ctx.textBaseline = "middle";
         ctx.fillText(resprateRef.current + "%", xCoor, yCoor);
      },
   };

   useEffect(() => {
      const fetchRespRate = async () => {
         let request =
            "?resprate&population=" +
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

         let response = await api.get<IRespRate>(request);

         const colorCode = [
            "rgb(74,222,128)",
            "rgb(248,113,113)",
            "rgb(178,190,181)",
         ];

         setData({
            labels: response.data
               ? response.data.detail.map((item) => item.label)
               : ["No data available"],
            datasets: [
               {
                  label: "No data available",
                  data: response.data
                     ? response.data.detail.map((item) => item.data)
                     : [0],
                  backgroundColor: response.data
                     ? response.data.detail.map(
                          (item) => colorCode[item.colorCode]
                       )
                     : "rgb(0, 0, 0)",
               },
            ],
         });

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
                     boxWidth: 14,
                     boxHeight: 14,
                     padding: 18,
                     color: "black",
                  },
                  onClick: function () {},
               },
               title: {
                  display: true,
                  text:
                     "Response Rate for " +
                     question?.substring(0, 3) +
                     " (" +
                     option?.yeardrop +
                     ")",
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
                        if (context.label === "Responded") {
                           return `${context.formattedValue} student(s) have responded to this question.`;
                        } else if (context.label === "Not Applicable") {
                           return `${context.formattedValue} student(s) have responded with "Not Applicable".`;
                        } else if (context.label === "Not Participate") {
                           return `${context.formattedValue} student(s) did not participate in this question.`;
                        }
                     },
                  },
                  bodyFont: {
                     size: 18,
                  },
                  padding: 10,
                  animation: {
                     duration: 100,
                  },
                  displayColors: false,
               },
            }
         };
         setChartOption(doughnutOption);
         resprateRef.current = response.data ? response.data.resp_rate : 0;
      };
      fetchRespRate();
   }, [question]);
   return (
      <Doughnut data={data} options={chartOption} plugins={[doughnutLabel]} />
   );
}

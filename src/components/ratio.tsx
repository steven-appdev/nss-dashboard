import {
   Chart as ChartJS,
   ArcElement,
   Tooltip,
   Legend,
   ChartOptions,
} from "chart.js";
import { useState } from "react";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Ratio() {
   const [option, setOption] = useState<ChartOptions<"doughnut">>({
      maintainAspectRatio: false,
      responsive: true,
      devicePixelRatio: 2,
      plugins:{
        legend:{
            position:"bottom",
            labels:{
                padding: 20,
                boxWidth: 18,
                boxHeight: 18,
                font:{
                    size:16
                }
            },
            onClick: function(event, legendItem) {}
        },
        title: {
            display: true,
            text: "Total Responses for ",
            font: {
               size: 20
            },
            padding:15
         },
         datalabels: {
            display: false
         },
      }
   });

   const data = {
      labels: ["Positive", "Negative"],
      datasets: [
         {
            label: "# of Votes",
            data: [12, 19],
            backgroundColor: ["rgb(74,222,128)", "rgb(248,113,113)"],
         },
      ],
   };

   return <Doughnut data={data} options={option} />;
}

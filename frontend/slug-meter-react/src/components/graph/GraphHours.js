import classes from "./GraphHours.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  annotationPlugin
);

  // const avgHighLine = {
  //   id: "avgHighLine",
  //   afterDatasetsDraw(chart, args, pluginOptions) {
  //     const {
  //       ctx,
  //       chartArea: { top, bottom, left, right, width, height },
  //       scales: { x, y },
  //     } = chart;

  //     ctx.save();
  //     ctx.beginPath();
  //     ctx.moveTo(left, y.getPixelForValue(80));
  //     ctx.lineTo(right, y.getPixelForValue(80));
  //     ctx.stroke();
  //   },
  // };
function median(arr) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);

  if (sortedArr.length % 2 === 0) {
    return (sortedArr[middle - 1] + sortedArr[middle]) / 2;
  } else {
    return sortedArr[middle];
  }
}

function calculateQuartiles(arr) {
  let q1 = median(arr.slice(0, Math.floor(arr.length / 2)));
  let q2 = median(arr);
  let q3 = median(arr.slice(Math.ceil(arr.length / 2)));
  return [q1, q2, q3]
}
  

function UTCtoLabelTime(date) {
  let period = "am";
  let time = new Date(date);
  let hour = time.getHours();
  if (hour > 12) {
    hour -= 12;
    period = "pm";
  }

  return hour + " " + period;
}

function currentTime() {
  let period = "am";
  let currentTime = new Date();
  let hour = currentTime.getHours();
  if (hour > 12) {
    hour -= 12;
    period = "pm";
  }

  return hour + " " + period;
} 

function GraphHours(props) {
  let labels = [];
  let values = [];
  let quartiles;
  let colors = Array(5).fill("rgba(18, 149, 216, 0.5)");
  if (props.graphData != null) {
    for (let i = 0; i < props.graphData.length; i++) {
      const time = UTCtoLabelTime(props.graphData[i]["time"]);
      labels.push(time);
      values.push(props.graphData[i]["count"]);
    }
    quartiles = calculateQuartiles(values);
  }

  colors[labels.indexOf(currentTime())] = 'rgb(255, 205, 0, 0.5)';


  const options = {
    responsive: true,
    layout: {
      padding: {
        right: 20,
      },
    },
    plugins: {
      title: {
        display: false,
        text: "Chart.js Bar Chart",
      },
      annotation: {
        annotations: {
          line1: {
            type: 'line',
            yMin: quartiles[0],
            yMax: quartiles[0],
            borderColor: 'rgb(18, 149, 216)',
            borderWidth: 2,
          },
          line2: {
            type: 'line',
            yMin: quartiles[2],
            yMax: quartiles[2],
            borderColor: 'rgb(255, 205, 0)',
            borderWidth: 2,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        }
      },
      y: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      bar: {
        borderRadius: 8,
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label: "Number of People",
        data: values,
        backgroundColor: colors,
      },
    ],
  };

  return (
    <div className={classes.graphPositionOutline}>
      {props.text}
      <br></br>
      {props.dateString}
      <br></br>
      <Bar data={data} options={options} />
    </div>
  );
}

export default GraphHours;


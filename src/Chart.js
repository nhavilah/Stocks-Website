import React from "react";
import { Line } from "react-chartjs-2";

//this chart code was sourced from https://codesandbox.io/s/qqo8k12po9?file=/index.js:1859-1901 
// and then modified to work better for me
export function Chart(props) {
    //customises what data is displayed and how it is 
    //displayed on the chart
    const data = {
        labels: props.timestamps,
        datasets: [
            {
                label: props.name,
                fill: false,
                lineTension: 0.1,
                backgroundColor: 'rgba(76, 163, 175,0.4)',
                borderColor: 'rgba(76, 163, 175,1)',
                color: 'rgba(76, 163, 175,0.4)',
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: 'rgba(76, 163, 175,1)',
                pointBackgroundColor: '#fff',
                pointBorderWidth: 1,
                pointHoverRadius: 1,
                pointHoverBackgroundColor: 'rgba(76, 163, 175,1)',
                pointHoverBorderColor: 'rgba(220,220,220,1)',
                pointHoverBorderWidth: 1,
                pointRadius: 1,
                pointHitRadius: 1,
                data: props.values,
            }
        ]
    };
    const lineOptions = {
        scales: {
            xAxes: [{
                gridLines: {
                    display: true,
                }, scaleLabel: {
                    display: true,
                    labelString: "TimeStamp"
                }
            }],
            yAxes: [{
                gridLines: {
                    display: true,
                }, scaleLabel: {
                    display: true,
                    labelString: props.yaxisTitle
                },
                ticks: {
                    beginAtZero: true,
                    // Return an empty string to draw the tick line but hide the tick label
                    // Return `null` or `undefined` to hide the tick line entirely
                    userCallback(value) {
                        // Convert the number to a string and splite the string every 3 charaters from the end
                        value = value.toString();
                        value = value.split(/(?=(?:...)*$)/);

                        // Convert the array to a string and format the output
                        value = value.join('.');
                        return `${value}`;
                    },
                },
            }],
        },
        title: {
            display: true,
            text: props.chartTitle
        },
        legend: {
            display: false,
        },
        tooltips: {
            mode: 'label',
            intersect: false
        },
        hover: {
            mode: 'index',
            intersect: false
        }
    };
    return <Line data={data} options={lineOptions} />
}
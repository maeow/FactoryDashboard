let listOfTime = [];
let listOfID = [];
let objectOfID = {};
let i = 0;

const WordExtractor = require("word-extractor");
const extractor = new WordExtractor();
const extracted = extractor.extract("src/API Test new Programmer.docx");

fetch('src/API Test new Programmer.txt')
.then(response => response.text()) 
.then(textString => { 
    textString = textString.replaceAll("]", ",").replaceAll("[", "");
    text = "["+textString.slice(0, textString.lastIndexOf(','))+"]";
    const dataJSON =JSON.parse(text);
    dataJSON.forEach((data) => {
        if(!listOfID.includes(data['SemiBatch'])){
          listOfID.push(data['SemiBatch']);
          objectOfID[data['SemiBatch']] = [];
          objectOfID[data['SemiBatch']][objectOfID[data['SemiBatch']].length] = data["Act_Weight"];
        }
        else{
          objectOfID[data['SemiBatch']][objectOfID[data['SemiBatch']].length] = data["Act_Weight"];
        }

        if(!listOfTime.includes(data["DateTime"])){
          listOfTime.push(data["DateTime"]);
        }
    });
    console.log(objectOfID)
    plotGraph();
});

//gauge speed
const gaugeElement = document.querySelector(".gauge");
function setGaugeValue(value) {
  if (value < 0 || value > 1) {
    return;
  }
  document.querySelector(".gauge__fill").style.transform = `rotate(${
    value / 2
  }turn)`;
  document.querySelector(".gauge__cover").textContent = `${Math.round(
    value * 100
  )}%`;
}

function myTimer() {
  setGaugeValue((Math.random() * 100)/100);
}

function plotGraph(){
  var listOfTrace = [];
  listOfID.forEach(id => {
    var listOfData = [].concat(objectOfID[id].slice(0, i+1));
    for (let j = 0; j < listOfTime.length;j++) {
      if(j>i){
        listOfData.push(null);
      }
    }
      var trace = {
        x: listOfTime,
        y: listOfData,
        mode: 'lines+markers',
        type: 'scatter',
        name: id
      }
      listOfTrace.push(trace);
  });

  var dataGraph = listOfTrace;
  var layout = {showlegend: true,
    legend: {
      orientation: 'h', // Horizontal orientation
      x: 0.5, // Centered 
      y: 1,   // top
      xanchor: 'center', 
      yanchor: 'bottom',
      font: {
        size: 8.5,
      }
    },
    font: {
      family: 'Nunito, sans-serif',
    },
    title: {
      text: 'Storage',
      font: {
        size: 24,
      },
      pad: {
        t: 50 // ระยะห่างจากขอบด้านบนของกราฟถึงชื่อกราฟ
      }
    },
    xaxis: {
      title: {
        text: 'Datetime',
        standoff: 20 
      },
      tickfont: {
        size: 8.5
      },
      automargin: true
    },
    yaxis: {
        title: 'Act_Weight',
        range: [-5000, 21000],
        fixedrange: false,
        autorange: false
      }};
  Plotly.newPlot('myDiv', dataGraph, layout);
  
  i++;
  i = i%7;
  setTimeout(plotGraph, 1000)
}

setGaugeValue((Math.random() * 100)/100);
setInterval(myTimer, 1000);
let listOfTime = [];
let listOfID = [];
let objectOfID = {};
let i = 0;

//import docx file 
const docxUrl = 'src/API Test new Programmer.docx';
fetch(docxUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
      return response.arrayBuffer();
    })
  .then(arrayBuffer => {
    return mammoth.extractRawText({ arrayBuffer: arrayBuffer });
  })
  .then(result => {
    textString = (result.value).replaceAll("]", ",").replaceAll("[", "");
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
    plotGraph();
    })
  .catch(error => {
    console.error('Error:', error);
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

//random gague value
function myTimer() {
  setGaugeValue((Math.random() * 100)/100);
}

//update graph
function updatePlot(){
  var updateY = [];
  listOfID.forEach(id => {
    var listOfData = [].concat(objectOfID[id].slice(0, i+1));
    for (let j = 0; j < listOfTime.length;j++) {
      if(j>i){
        listOfData.push(null);
      }
    }
      updateY.push(listOfData);
  });

  const range = size => Array.from(Array(size).keys());

  Plotly.restyle('myDiv', { y: updateY }, range(listOfID.length));
  i++;
  i = i%7;
  setTimeout(updatePlot, 1000)
}

//create graph
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
  setTimeout(updatePlot, 1000)
}

setGaugeValue((Math.random() * 100)/100);
setInterval(myTimer, 1000);
var statusText = document.querySelector('#statusText');
var moodText = document.querySelector('#moodText');

statusText.addEventListener('click', function() {
  statusText.textContent = 'Breathe...';
  moodText.textContent = 'Relaxed';
  heartRates = [];
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    statusText.textContent = error;
  });
});

function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    statusText.innerHTML = heartRateMeasurement.heartRate + ' &#x2764;';
    predict().then(results=> moodText.innerHTML=results);
    heartRates.push(heartRateMeasurement.heartRate);
  });
}

function getMeasurments(){
  var x = document.getElementById("container");
  x.style.display = "none";
  var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(heartRates));
  var a = document.createElement('a');
  a.href = 'data:' + data;
  a.download = 'data.json';
  a.innerHTML = 'download JSON';
  var container = document.getElementById('download');
  container.appendChild(a);
}
var heartRates = [];

async function predict(){
  const model = await tf.loadModel('https://zealous-tereshkova-d855b9.netlify.com/model.json');
  if (heartRates.length >= 10){
	heartRates=heartRates.slice(-10);
	tmp=heartRates.slice(-10);
	for (var j = 0; j < tmp.length; j++){
		tmp[j]*=scales[j];
		tmp[j]+=min_[j];
	}
	console.log(tmp);
    const shape = [1, 10]; // 2 rows, 3 columns
    const a = tf.tensor(tmp, shape);
    const prediction = model.predict(a);
    var readable_output = prediction.dataSync();
    console.log(readable_output);
    if (readable_output[0]>0.55){
    return(Promise.resolve("Excited"));   
    }  
  }
  return(Promise.resolve("Relaxed"));
}
var scales = [0.023255813953488372, 0.023255813953488372, 0.023809523809523808, 0.023809523809523808, 0.023809523809523808, 0.023809523809523808, 0.025, 0.025, 0.024390243902439025, 0.025];
var min_ = [-1.627906976744186, -1.6511627906976745, -1.6904761904761905, -1.6904761904761905, -1.6666666666666665, -1.6904761904761905, -1.8, -1.8, -1.7560975609756098, -1.8];

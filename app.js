/* Global variables decrlaing the values of heatz Rate and the modd status
*/
var statusText = document.querySelector('#statusText');
var moodText = document.querySelector('#moodText');

/*
Listener to changes heart rate sensor
*/
statusText.addEventListener('click', function() {
  statusText.textContent = 'Breathe...';
  moodText.textContent = 'Relaxed';
  heartRates =new HeartRate();;
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    statusText.textContent = error;
  });
});
/*
The function is directly responsible changes of UI values 
*/
function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    statusText.innerHTML = heartRateMeasurement.heartRate + ' &#x2764;';
    heartRates.predicted_value.then(results=> moodText.innerHTML=results);
    heartRates.addelement(heartRateMeasurement.heartRate);
  });
}

/*
The function updates the heartRate class values i.e. it updates the last 10 heart rate vlaues
amd and the state of the person
*/
function getMeasurments(){
	heartRates.get();

}

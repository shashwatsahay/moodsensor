var statusText = document.querySelector('#statusText');
var moodText = document.querySelector('#moodText');

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

function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    var heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    statusText.innerHTML = heartRateMeasurement.heartRate + ' &#x2764;';
    heartRates.predicted_value.then(results=> moodText.innerHTML=results);
    heartRates.addelement(heartRateMeasurement.heartRate);
  });
}

function getMeasurments(){
	heartRates.get();

}

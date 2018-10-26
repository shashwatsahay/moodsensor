class HeartRate {
    constructor() {
      this.heartRates= new Array();
      this.predicted_value=Promise.resolve("Calculating...");
      this.scales = [0.023255813953488372, 0.023255813953488372, 0.023809523809523808, 0.023809523809523808, 0.023809523809523808, 0.023809523809523808, 0.025, 0.025, 0.024390243902439025, 0.025];
      this.min_ = [-1.627906976744186, -1.6511627906976745, -1.6904761904761905, -1.6904761904761905, -1.6666666666666665, -1.6904761904761905, -1.8, -1.8, -1.7560975609756098, -1.8];

  }
  addelement(val){
  this.heartRates.push(val);
  }
  get(){
    var x = document.getElementById("container");
    x.style.display = "none";
    var x = document.getElementById("download");
    x.style.display = "block";
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.heartRates));
    var a = document.createElement('a');
    a.id="downloadlink";
    a.href = 'data:' + data;
    a.download = 'data.json';
    a.innerHTML = 'download JSON';
    var container = document.getElementById('download');
    container.appendChild(a);
  }
  async predict(){
  const model = await tf.loadModel('https://zealous-tereshkova-d855b9.netlify.com/model.json');
  if (this.heartRates.length >= 10){
	this.heartRates=heartRates.slice(-10);
	tmp=heartRates.slice(-10);
	for (var j = 0; j < tmp.length; j++){
		tmp[j]*=this.scales[j];
		tmp[j]+=this.min_[j];
	}
    const shape = [1, 10]; // 2 rows, 3 columns
    const a = tf.tensor(tmp, shape);
    const prediction = model.predict(a);
    var readable_output = prediction.dataSync();
    console.log(readable_output);
    if (readable_output[0]>0.55){
        this.predicted_value=Promise.resolve("Excited");   
    }
    else{
	this.predicted_value=Promise.resolve("Relaxed"));  
    }
  }
}
}


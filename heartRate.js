class HeartRate {
    constructor() {
      this.heartRates= new Array();
      this.predicted_value=Promise.resolve("Calculating...");
      this.scales = [0.02, 0.02040816326530612, 0.02, 0.0196078431372549, 0.019230769230769232, 0.018867924528301886, 0.018867924528301886, 0.018518518518518517, 0.018518518518518517, 0.01818181818181818];
      this.min_ = [-1.4000000000000001, -1.4285714285714284, -1.4000000000000001, -1.3725490196078431, -1.3461538461538463, -1.320754716981132, -1.320754716981132, -1.2962962962962963, -1.2962962962962963, -1.2727272727272727];

  }
  addelement(val){
  this.heartRates.push(val);
	  this.predict();
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
  const model = await tf.loadModel('https://shashwatsahay.github.io/moodsensor/model.json');
  if (this.heartRates.length >= 10){
	this.heartRates=this.heartRates.slice(-10);
	var tmp=this.heartRates.slice(-10);
	for (var j = 0; j < tmp.length; j++){
		tmp[j]*=this.scales[j];
		tmp[j]+=this.min_[j];
	}
    const shape = [1, 10]; // 2 rows, 3 columns
    const a = tf.tensor(tmp, shape);
    const prediction = model.predict(a);
    var readable_output = prediction.dataSync();
    if (readable_output[0]>0.70){
        this.predicted_value=Promise.resolve("Excited");   
    }
    else{
	this.predicted_value=Promise.resolve("Relaxed");  
    }
  }
}
}


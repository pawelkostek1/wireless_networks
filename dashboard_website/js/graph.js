// Author: Dominic Heaton
// LPWAN2 - University of Southampton


  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAu-3f0gwQxpv7_xyisyGoBUtHymejxmcQ",
    authDomain: "wireless-networks-lpwan2.firebaseapp.com",
    databaseURL: "https://wireless-networks-lpwan2.firebaseio.com",
    projectId: "wireless-networks-lpwan2",
    storageBucket: "wireless-networks-lpwan2.appspot.com",
    messagingSenderId: "868186919348"
  };
  firebase.initializeApp(config);

  // Record of temperature and humidity
  var temperature = ["0"];
  var humidity = ["0"];
  var sound = ["0"];
  var rssi = [];
  // var gateways = [];
  var gateway1 = new Object();
  var gateway2 = new Object();
  var gateway3 = new Object();
  var gateway4 = new Object();


  window.onload = function () {
    var temperatureDataPoints = [{y : 0}];
    var humidityDataPoints = [{y: 0}];
    var soundDataPoints = [{y: 0}];
    var rssiDataPoints = [];
    var snrDataPoints = [];
    var chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      title: {
        text: "Sensor Data"
      },
      data: [{
        type: "spline",
        showInLegend: true,
        name: "Temperature",
        dataPoints: temperatureDataPoints
      }, {
        type: "spline",
        showInLegend: true,
        name: "Humidity",
        dataPoints: humidityDataPoints
      },{
        type: "spline",
        showInLegend: true,
        name: "Sound",
        dataPoints: soundDataPoints
      }]
    });
    chart.render();

    var chart2 = new CanvasJS.Chart("chartContainer2", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title:{
        text: "RSSI Measurements"
      },
      axisY: {
        title: "RSSI",
        suffix: "/ dB",
        reversed: false
      },
      axisX2: {
        tickThickness: 0,
        labelAngle: 0
      },
      data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: rssiDataPoints
      }]
    });
    chart2.render();

    var chart3 = new CanvasJS.Chart("chartContainer3", {
      animationEnabled: true,
      exportEnabled: true,
      theme: "light2", // "light1", "light2", "dark1", "dark2"
      title:{
        text: "SNR Measurements"
      },
      axisY: {
        title: "SNR",
        suffix: "",
        reversed: false
      },
      axisX2: {
        tickThickness: 0,
        labelAngle: 0
      },
      data: [{
        type: "column", //change type to bar, line, area, pie, etc
        //indexLabel: "{y}", //Shows y value on all Data Points
        indexLabelFontColor: "#5A5757",
        indexLabelPlacement: "outside",
        dataPoints: snrDataPoints
      }]
    });
    chart3.render();

    function updateTemperatureChart(value) {
      temperatureDataPoints.push({y : value});
      humidityDataPoints.push({y: humidity[humidity.length - 1]});
      soundDataPoints.push({y: sound[sound.length - 1]});
      chart.render();
    }

    function updateHumidityChart(value) {
      humidityDataPoints.push({y : value});
      temperatureDataPoints.push({y: temperature[temperature.length - 1]});
      soundDataPoints.push({y: sound[sound.length - 1]});
      chart.render();
    }

    function updateSoundChart(value) {
      soundDataPoints.push({y : value});
      temperatureDataPoints.push({y: temperature[temperature.length - 1]});
      humidityDataPoints.push({y: humidity[humidity.length - 1]});
      chart.render();
    }

    function checkGateways() {
      var numberOfGateways;
      firebaseGateways.on('value', snap => {
        numberOfGateways = snap.val().length;
      });
      return numberOfGateways;
    }

    function updateRSSI() {
      rssiDataPoints[0] = {y: gateway1.rssi, label: gateway1.location};
      rssiDataPoints[1] = {y: gateway2.rssi, label: gateway2.location};
      rssiDataPoints[2] = {y: gateway3.rssi, label: gateway3.location};
      rssiDataPoints[3] = {y: gateway4.rssi, label: gateway4.location};
      chart2.render();
    }

    function updateSNR() {
      snrDataPoints[0] = {y: gateway1.snr, label: gateway1.location};
      snrDataPoints[1] = {y: gateway2.snr, label: gateway2.location};
      snrDataPoints[2] = {y: gateway3.snr, label: gateway3.location};
      snrDataPoints[3] = {y: gateway4.snr, label: gateway4.location};
      chart3.render();
    }

    //create references to firebase
    const firebaseRef = firebase.database().ref().child('fix');
    const firebaseTemperature = firebaseRef.child('payload_raw').child('0');
    const firebaseHumidity = firebaseRef.child('payload_raw').child('1');
    const firebaseSound = firebaseRef.child('payload_raw').child('2');
    const firebaseGateways = firebaseRef.child('metadata').child('gateways');

    //take snapshot of all the sensor data
    firebaseTemperature.on('value', snap => {
      temperature.push(parseInt(JSON.stringify(snap.val(), null, 3)));
      value = temperature[temperature.length - 1];
      console.log("Temperature: " + temperature);
      updateTemperatureChart(value);
    });

    //take snapshot of all the sensor data
    firebaseHumidity.on('value', snap => {
      humidity.push(parseInt(JSON.stringify(snap.val(), null, 3)));
      value = humidity[humidity.length - 1];
      console.log("Humidity: " + humidity);
      updateHumidityChart(value);
    });

    //take snapshot of all the sensor data
    firebaseSound.on('value', snap => {
      sound.push(parseInt(JSON.stringify(snap.val(), null, 3)));
      value = sound[sound.length - 1];
      console.log("Sound: " + sound);
      updateSoundChart(value);
    });

    /*-------*/
    //Identification Information
    //location: longitude, latitude, gtw_id
    //physics: 50.935033, -1.399582, eui-7276fffffe01028c
    //ecs: 50.937274, -1.397667, eui-b827ebfffeac4b12
    //building 7(1): 50.935330, -1.393598, eui-7276fffffe0103f0
    //building 7(2): 50.935567, -1.394270, eui-b827ebfffe2d3798
    /*-------*/

    //check Metadata for the gateways
    //rssi array in the following order: 0=Physics,1=ECS,2=Building7(1),3=Building7(2)
    firebaseGateways.on('value', snap => {
      var i;
      for(i = 0; i < checkGateways(); i ++) {
        if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe01028c') {
          gateway1.rssi = snap.child(i).child('rssi').val();
          gateway1.id = 'eui-7276fffffe01028c';
          gateway1.location = 'Physics';
          gateway1.snr = snap.child(i).child('snr').val();
          // console.log(gateway1);
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffeac4b12') {
          gateway2.rssi = snap.child(i).child('rssi').val();
          gateway2.id = 'eui-b827ebfffeac4b12';
          gateway2.location = 'ECS';
          gateway2.snr = snap.child(i).child('snr').val();
          // console.log(gateway2);
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe0103f0') {
          gateway3.rssi = snap.child(i).child('rssi').val();
          gateway3.id = 'eui-7276fffffe0103f0';
          gateway3.location = 'Building 7 (1)';
          gateway3.snr = snap.child(i).child('snr').val();
          // console.log(gateway3);
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffe2d3798') {
          // rssi[3] = snap.child(i).child('rssi').val();
          gateway4.rssi = snap.child(i).child('rssi').val();
          gateway4.id = 'eui-b827ebfffe2d3798';
          gateway4.location = 'Building 7 (2)';
          gateway4.snr = snap.child(i).child('snr').val();
          // console.log(gateway4);
        }
      }
      updateRSSI();
      updateSNR();
    });

  }



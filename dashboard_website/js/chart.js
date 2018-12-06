// Author: Pawel Kostkowski
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

// Get a reference to the database service
var database = firebase.database();


//Create charts
var ctx = document.getElementById('weatherChart').getContext('2d')
var chart = new Chart(ctx, {
    //The type of chart we want to createElement
    type: 'line',

    //The data for our dataset
    data: {
        labels: [],
	    datasets: [{
		    label: "Temperature",
		    backgroundColor: 'rgb(255, 99, 132)',
		    borderColor: 'rgb(255, 99, 132)',
            fill: false,
		    data: [],
            yAxisID: 'temperature',
	    }, {
            label: "Humidity",
            backgroundColor: 'rgb(54, 162, 235)',
            borderColor: 'rgb(54, 162, 235)',
            fill: false,
            data: [],
            yAxisID: 'humidity',
        }]
    },

    //Configuration options
    options: {
        scales: {
            yAxes: [{
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'left',
                id: 'temperature',
                scaleLabel: {
                    labelString: 'Temperature',
                    display: true,
                },
            }, {
                type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                position: 'right',
                id: 'humidity',
                scaleLabel: {
                    labelString: 'Humidity',
                    display: true,
                },

                // grid line settings
                gridLines: {
                    drawOnChartArea: false, // only want the grid lines for one axis to show up
                },
            }],
            xAxes: [{
                scaleLabel: {
                    labelString: 'Time',
                    display: true,
                }
            }],
        }
    }
});
var ctx = document.getElementById('noiseChart').getContext('2d')
var chart2 = new Chart(ctx, {
    //The type of chart we want to createElement
    type: 'line',

    //The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: "Noise levels",
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgb(75, 192, 192)',
            fill: true,
            data: [],
        }]
    },

    //Configuration options
    options: {
        scales: {
            yAxes: [{
                type: 'logarithmic', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
                display: true,
                scaleLabel: {
                    labelString: 'Voltage',
                    display: true,
                }
            }],
            xAxes: [{
                scaleLabel: {
                    labelString: 'Time',
                    display: true,
                }
            }],
        }
    }
});

var ctx = document.getElementById('rssiChart').getContext('2d')
var chart3 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Physics', 'ECS', 'Building 7 (1)', 'Building 7 (2)'],
        datasets: [{
            label: "RSSI Measurements",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
            data: [0, 0, 0, 0],
        }]
    },
    options: {
        legend: { display: false },
    }
});

var ctx = document.getElementById('snrChart').getContext('2d')
var chart4 = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Physics', 'ECS', 'Building 7 (1)', 'Building 7 (2)'],
        datasets: [{
            label: "SNR Measurements",
            backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9"],
            data: [1, 0, 0, 0],
        }]
    },
    options: {
        legend: { display: false },
    }
});

//Create references to Firebase
const firebaseRef = firebase.database().ref().child('fix');
const firebaseTemperature = firebaseRef.child('payload_raw').child('0');
const firebaseHumidity = firebaseRef.child('payload_raw').child('1');
const firebaseNoise = firebaseRef.child('payload_raw').child('2');
const firebaseTime = firebaseRef.child('metadata').child('time');
const firebaseGateways = firebaseRef.child('metadata').child('gateways');

//Retrieve data from the database
firebaseTemperature.on('value', function(snapshot) {

    console.log("Temperature: " + snapshot.val());
    chart.data.datasets[0].data.push(snapshot.val());
    chart.update();
});

firebaseHumidity.on('value', function(snapshot) {

    console.log("Humidity: " + snapshot.val());
    chart.data.datasets[1].data.push(snapshot.val());
    chart.update();
});

firebaseNoise.on('value', function(snapshot) {

    console.log("Noise: " + snapshot.val());
    chart2.data.datasets[0].data.push(snapshot.val());
    chart2.update();
});

firebaseTime.on('value', function(snapshot) {
    console.log("Time: " + snapshot.val());
    console.log("Parsed time: " + moment(snapshot.val()).format("HH:mm"));
    var time = moment(snapshot.val()).format("HH:mm");
    chart.data.labels.push(time);
    chart.update();
    chart2.data.labels.push(time);
    chart2.update();
});

firebaseGateways.on('value', snap => {
    var i;
    var numberOfGateways = snap.val().length;
    for(i = 0; i < numberOfGateways; i++) {
        if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe01028c') {
            chart3.data.datasets[0].data[0]=(snap.child(i).child('rssi').val());
            chart4.data.datasets[0].data[0]=(snap.child(i).child('snr').val());
            console.log("snr: " + snap.child(i).child('snr').val());
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffeac4b12') {
            chart3.data.datasets[0].data[1]=(snap.child(i).child('rssi').val());
            chart4.data.datasets[0].data[1]=(snap.child(i).child('snr').val());
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe0103f0') {
            chart3.data.datasets[0].data[2]=(snap.child(i).child('rssi').val());
            chart4.data.datasets[0].data[2]=(snap.child(i).child('snr').val());
        }
        if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffe2d3798') {
            chart3.data.datasets[0].data[3]=(snap.child(i).child('rssi').val());
            chart4.data.datasets[0].data[3]=(snap.child(i).child('snr').val());
        }
    }
    chart3.update();
    chart4.update();
});
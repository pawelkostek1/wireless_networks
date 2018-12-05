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
  
  //Create references to Firebase
  const firebaseRef = firebase.database().ref().child('fix');
  const firebaseTemperature = firebaseRef.child('payload_raw').child('0');
  const firebaseHumidity = firebaseRef.child('payload_raw').child('1');
  const firebaseNoise = firebaseRef.child('payload_raw').child('2');
	
  //Retrieve data from the database
  firebaseTemperature.on('value', function(snapshot) {
	
	console.log("Temperature: " + snapshot.val());
  });
  
  firebaseHumidity.on('value', function(snapshot) {
	
	console.log("Humidity: " + snapshot.val());
  });
  
  firebaseNoise.on('value', function(snapshot) {
	
	console.log("Noise: " + snapshot.val());
  });
  
  //Create charts
  var ctx = document.getElementById('weatherChart').getContext('2d')
  var chart = new Chart(ctx, {
	  //The type of chart we want to createElement
	  type: 'line',
	  
	  //The data for our dataset
	  data: {
		  labels: ["January", "February", "March", "April", "May", "June", "July"],
		  datasets: [{
			  label: "Example chart",
			  backgroundColor: 'rgb(255, 99, 132)',
			  borderColor: 'rgb(255, 99, 132)',
			  data: [0, 10, 5, 2, 20, 30, 45],
		  }]
	  },
	  
	  //Configuration options
	  options: {}
  })
  
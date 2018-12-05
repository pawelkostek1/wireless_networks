const functions = require('firebase-functions');
var ttn = require("ttn")
var firebase = require("firebase")

var appID = "lpwan2"
var accessKey = "ttn-account-v2.KU1ve7D8azCny1gCpIXuC-veoWDjyWx9Afg8SyePjEs"

var config = {
    apiKey: "AIzaSyAu-3f0gwQxpv7_xyisyGoBUtHymejxmcQ",
    authDomain: "wireless-networks-lpwan2.firebaseapp.com",
    databaseURL: "https://wireless-networks-lpwan2.firebaseio.com",
    projectId: "wireless-networks-lpwan2",
    storageBucket: "wireless-networks-lpwan2.appspot.com",
    messagingSenderId: "868186919348"
  };
firebase.initializeApp(config);

var databaseRef = firebase.app().database().ref();

ttn.data(appID, accessKey)
  .then(function (client) {
    client.on("uplink", function (devID, payload) {
      console.log("Received uplink from ", devID)
      console.log(payload)
      databaseRef.child("fix/").set(payload);
      databaseRef.push(payload);
    })
  })
  .catch(function (error) {
    console.error("Error", error)
    process.exit(1)
  })


exports.bigben = functions.https.onRequest((req, res) => {
	const hours = (new Date().getHours() % 12) + 1 //London is UTC + 1hr;
	res.status(200).send(
		`<!doctype html>
			<head>
				<title>Time</title>
			</head>
			<body>
				${'BONG'.repeat(hours)}
			</body>
		</html>`
	);
});

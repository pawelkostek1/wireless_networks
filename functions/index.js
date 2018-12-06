const functions = require('firebase-functions');
var ttn = require("ttn")
var firebase = require("firebase")

const express = require('express');
const cors = require('cors')

const app = express();

//Automatically allow cross-origin requests
app.use(cors({ origin: true }));

// Initialize ttn API
//var appID = "lpwan2soton"
//var accessKey = "ttn-account-v2.Jj5MgeF1bzbqM7_CVstjmjrp3vKuyfKjsWGyGaiwXzM"

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDclr-1DeCZjo1ou3qzRb686Ayp_FL0GRo",
    authDomain: "lpwan2-wireless-networks.firebaseapp.com",
    databaseURL: "https://lpwan2-wireless-networks.firebaseio.com",
    projectId: "lpwan2-wireless-networks",
    storageBucket: "lpwan2-wireless-networks.appspot.com",
    messagingSenderId: "884341908719"
};
firebase.initializeApp(config);

var databaseRef = firebase.app().database().ref();
/*
ttn.data(appID, accessKey)
  .then((client) => {
    client.on("uplink", (devID, payload) => {
      console.log("Received uplink from ", devID)
      console.log(payload)
      databaseRef.child("fix/").set(payload);
      databaseRef.push(payload);
    })
    return true;
  })
  .catch((error) => {
    console.error("Error", error)
    process.exit(1)
  })
*/
app.use(express.json());

app.post('/firebase', (req, res) => {
    console.log("POST body: ", req.body);
    databaseRef.child("fix/").set(req.body);
    databaseRef.push(req.body);
    res.send(req.body);
});
/*
app.get('/firebase', (req, res) => {

    const hours = (new Date().getHours() % 12) + 1;
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
*/
exports.firebase = functions.https.onRequest(app);

/*
(req, res) => {
    const hours = (new Date().getHours() % 12) + 1;
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
}
 */

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

  //dumb html elements and THEIR IDs
  const payloadData = document.getElementById('payload_data');
  const metaData = document.getElementById('meta_data');
  const completeData = document.getElementById('complete_data');

  //create firebase references
  const firebaseRef = firebase.database().ref().child('fix');
  const firebasePayload = firebaseRef.child('payload_raw');
  const firebaseGateways = firebaseRef.child('metadata');

  //display payload
  firebasePayload.on('value', snap => {
    payloadData.innerText = JSON.stringify(snap.val(), null, 3);
  });

  //display metadata
  firebaseGateways.on('value', snap => {
    metaData.innerText = JSON.stringify(snap.val(), null, 3);
  });

  //display complete raw data
  firebaseRef.on('value', snap => {
    completeData.innerText = JSON.stringify(snap.val(), null, 3);
  });



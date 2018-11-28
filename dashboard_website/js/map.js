// Author: Dominic Heaton
// LPWAN2 - University of Southampton
var map;

//Useful Identification Information
//location: latitude, longitude, gtw_id
//physics: 50.935033, -1.399582, eui-7276fffffe01028c
//ecs: 50.937274, -1.397667, eui-b827ebfffeac4b12
//building 7(1): 50.935330, -1.393598, eui-7276fffffe0103f0
//building 7(2): 50.935567, -1.394270, eui-b827ebfffe2d3798

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

function initMap()
{
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 50.935719, lng: -1.396207},
    zoom: 16
  });

  //create references to firebase
  const firebaseRef = firebase.database().ref().child('fix');
  const firebaseGateways = firebaseRef.child('metadata').child('gateways');
  var gateway1 = new Object();
  var gateway2 = new Object();
  var gateway3 = new Object();
  var gateway4 = new Object();
  var physicsCoordinates;
  var ecsCoordinates;
  var building7_1Coordinates;
  var building7_2Coordinates;

  firebaseGateways.on('value', snap => {
    var i;
    for(i = 0; i < checkGateways(); i ++) {
      if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe01028c') {
        gateway1.rssi = Math.abs(snap.child(i).child('rssi').val());
        gateway1.id = 'eui-7276fffffe01028c';
        gateway1.location = 'Physics';
        gateway1.snr = snap.child(i).child('snr').val();
        gateway1.latitude = snap.child(i).child('latitude').val();
        gateway1.longitude = snap.child(i).child('longitude').val();
        // console.log(gateway1);
      }
      if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffeac4b12') {
        gateway2.rssi = Math.abs(snap.child(i).child('rssi').val());
        gateway2.id = 'eui-b827ebfffeac4b12';
        gateway2.location = 'ECS';
        gateway2.snr = snap.child(i).child('snr').val();
        gateway2.latitude = snap.child(i).child('latitude').val();
        gateway2.longitude = snap.child(i).child('longitude').val();
        // console.log(gateway2);
      }
      if(snap.child(i).child('gtw_id').val() == 'eui-7276fffffe0103f0') {
        gateway3.rssi = Math.abs(snap.child(i).child('rssi').val());
        gateway3.id = 'eui-7276fffffe0103f0';
        gateway3.location = 'Building 7 (1)';
        gateway3.snr = snap.child(i).child('snr').val();
        gateway3.latitude = snap.child(i).child('latitude').val();
        gateway3.longitude = snap.child(i).child('longitude').val();
        // console.log(gateway3);
      }
      if(snap.child(i).child('gtw_id').val() == 'eui-b827ebfffe2d3798') {
        // rssi[3] = snap.child(i).child('rssi').val();
        gateway4.rssi = Math.abs(snap.child(i).child('rssi').val());
        gateway4.id = 'eui-b827ebfffe2d3798';
        gateway4.location = 'Building 7 (2)';
        gateway4.snr = snap.child(i).child('snr').val();
        gateway4.latitude = snap.child(i).child('latitude').val();
        gateway4.longitude = snap.child(i).child('longitude').val();
        // console.log(gateway4);
      }
    }
    setLocations();

    var physicsContent = '<div id="content">'+
            '<div id="siteNotice"> </div>'+
            '<h6 id="firstHeading" class="firstHeading">Physics Gateway <br></h6>' +
            '<p> ID: ' + gateway1.id + '<br> Latitude: ' + gateway1.latitude + '<br> Longitude: ' + gateway1.longitude + '<br> Most Recent RSSI: -' + gateway1.rssi + 'dB <br> Most Recent SNR: ' + gateway1.snr + '</p>'+'</div>';

    var ecsContent = '<div id="content">'+
            '<div id="siteNotice"> </div>'+
            '<h6 id="firstHeading" class="firstHeading">ECS Gateway <br></h6>' +
            '<p> ID: ' + gateway2.id + '<br> Latitude: ' + gateway2.latitude + '<br> Longitude: ' + gateway2.longitude + '<br> Most Recent RSSI: -' + gateway2.rssi + 'dB <br> Most Recent SNR: ' + gateway2.snr + '</p>'+'</div>';

    var building7_1Content = '<div id="content">'+
            '<div id="siteNotice"> </div>'+
            '<h6 id="firstHeading" class="firstHeading">Building 7 (1) Gateway <br></h6>' +
            '<p> ID: ' + gateway3.id + '<br> Latitude: ' + gateway3.latitude + '<br> Longitude: ' + gateway3.longitude + '<br> Most Recent RSSI: -' + gateway3.rssi + 'dB <br> Most Recent SNR: ' + gateway3.snr + '</p>'+'</div>';

    var building7_2Content = '<div id="content">'+
            '<div id="siteNotice"> </div>'+
            '<h6 id="firstHeading" class="firstHeading">Building 7 (2) Gateway <br></h6>' +
            '<p> ID: ' + gateway4.id + '<br> Latitude: ' + gateway4.latitude + '<br> Longitude: ' + gateway4.longitude + '<br> Most Recent RSSI: -' + gateway4.rssi + 'dB <br> Most Recent SNR: ' + gateway4.snr + '</p>'+'</div>';

    var physicsInfo = new google.maps.InfoWindow({
      content: physicsContent
    });

    var ecsInfo = new google.maps.InfoWindow({
      content: ecsContent
    });

    var building7_1Info = new google.maps.InfoWindow({
      content: building7_1Content
    });

    var building7_2Info = new google.maps.InfoWindow({
      content: building7_2Content
    });

    var markerPhysics = new google.maps.Marker({
      position: physicsCoordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markerPhysics.addListener('click', function() {
      physicsInfo.open(map,markerPhysics);
    })

    var markerECS = new google.maps.Marker({
      position: ecsCoordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markerECS.addListener('click', function() {
      ecsInfo.open(map,markerECS);
    })

    var markerBuilding7_1 = new google.maps.Marker({
      position: building7_1Coordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markerBuilding7_1.addListener('click', function() {
      building7_1Info.open(map,markerBuilding7_1);
    })

    var markerBuilding7_2 = new google.maps.Marker({
      position: building7_2Coordinates,
      map: map,
      animation: google.maps.Animation.DROP
    });
    markerBuilding7_2.addListener('click', function() {
      building7_2Info.open(map,markerBuilding7_2);
    })
  });

  function checkGateways() {
    var numberOfGateways;
    firebaseGateways.on('value', snap => {
      numberOfGateways = snap.val().length;
    });
    return numberOfGateways;
  }

  function setLocations() {
    physicsCoordinates = {lat: gateway1.latitude, lng: gateway1.longitude};
    ecsCoordinates = {lat: gateway2.latitude, lng: gateway2.longitude};
    building7_1Coordinates = {lat: gateway3.latitude, lng: gateway3.longitude};
    building7_2Coordinates = {lat: gateway4.latitude, lng: gateway4.longitude};
  }

}

window.time="17:00";
(function () {
	 
	var database = firebase.database();

	const firebaseRef = firebase.database().ref().child('fix');
	const firebaseTime = firebaseRef.child('metadata').child('time');

	
	
	var angular_render = angular.module('angular_render', []);
	angular_render.controller('date_ctrl', ['$scope','$window', '$interval',function($scope, $window, $interval) {
			$scope.time = $window.time;
			$interval(function(){ $scope.time=$window.time }, 100)

	}]);
		
	firebaseTime.on('value', function(snapshot) {
		console.log("Angular time: " + snapshot.val());
		console.log("Parsed time for angular: " + moment(snapshot.val()).add(-8, 'hour').format("HH:mm"));
		window.time = moment(snapshot.val()).add(-8, 'hour').format("HH:mm");
		
	});
	 

})();

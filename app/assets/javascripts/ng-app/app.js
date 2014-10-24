angular.module('generosity', ['ngRoute', 'templates'])
	.config(['$routeProvider',
	  	function($routeProvider) {
	    	$routeProvider.
	      		when('/', {
	        		templateUrl: 'navbar.html',
	        		controller: 'UsersController'
	      		}).
	      		// when('/phones/:phoneId', {
	        // 		templateUrl: 'partials/phone-detail.html',
	        // 		controller: 'PhoneDetailCtrl'
	      		// }).
	      		otherwise({
	        		redirectTo: '/404'
	      		});
	  }])

	.controller('UsersController', ['$scope', '$http', function($scope, $http) {
		var self = this;

		self.username;
		self.realName;
		self.password;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		// self.recipient; //Should probably be renamed

		self.addUser = function() {
			$http.post('users/add', {username: self.username, password: self.password}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					errCode = data.errCode;
					console.log(errCode);
					if(errCode == -2) {
						alert("Error: This username already exists.");
					}
					else if(errCode == -3) {
						alert("Error: The username is empty, too long, or has invalid characters.");
					}
					else if(errCode == -4) {
						alert("Error: The password is empty, too long, or has invalid characters.");
					}
					else {
						alert("User created.");						
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					alert("Error.");
				});
		}

		self.createDummyUser = function() {
			self.username = "AlanChristopher";
			self.realName = "Alan Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
		};

		// self.login = function(name, pw) {

		// };

		// self.logout = function() {

		// };
	}])
	
	// .directive('directiveE', function() {
	// 	return {
	// 		restrict: 'E',
	// 		scope: {

	// 		},
	// 		templateUrl: "../../views/navbar.html.erb"
	// 	};
	// })
	
	// .directive('directiveA', function() {
	// 	return {
	// 		restrict: 'A',
	// 		scope: {
	// 			name: '@',
	// 			hobby: '@'
	// 		},
	// 		templateUrl: "example-module.html"
	// 	};
	// }) //Only put a semi-colon on the last directory of the module
	
	.directive('css1', function() {
		return {
			restrict: 'C',
			link: function(scope, element, attrs) {
      			element.css("width", 400),
      			element.css("font-style", "oblique");
      			element.css("color", "green");
      			element.css("font-size", "30px");
			}
		};
	});
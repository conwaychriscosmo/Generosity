angular.module('generosity', ['ngRoute', 'templates'])
	.config(['$routeProvider', '$locationProvider',
	  	function($routeProvider, $locationProvider) {
	    	$routeProvider.
	      		when('/', {
	        		templateUrl: "users-form.html",
	        		controller: 'UsersController'
	      		}).
	      		// when('/phones/:phoneId', {
	        // 		templateUrl: 'partials/phone-detail.html',
	        // 		controller: 'PhoneDetailCtrl'
	      		// }).
	      		otherwise({
	        		redirectTo: '/'
	      		});
	      	$locationProvider.html5Mode(true);
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
	
	.directive('navbar', function() {
		return {
			restrict: 'E',
			templateUrl: "navbar.html"
		};
	})

	.directive('usersForm', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "users-form.html"
		};
	})

	.directive('usersTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "users-tests.html"
		};
	})
	
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
	})

	.directive('testStatus', function() { //You do not need to account for the cases for which the rating is not a number.
		return {
			restrict: 'C',
			scope: {
			  message: '@'
			},
			link: function(scope, element, attrs) { //Note that this is a function of scope, NOT $scope!!
				if(scope.message.search("PASS") > 0) {
					element.css("color", "green");
				}
				else if(scope.message.search("FAIL") > 0) {
					element.css("color", "red");
				}
				else {
					element.css("color", "blue");
				}
			}
		};
	})

	.controller('UserTestController', ['$scope', '$http', '$controller', function($scope, $http, $controller) {
		var self = this;
		// var expect = chai.expect;
		// var expect = require('expect.js');

		self.totalTests = 0;
		self.passedTests = 0;
		self.messages = [];

		self.assert = function(condition, statement) {
			testMessage = "Test #" + (self.totalTests+1);
			if(condition) {
				self.passedTests += 1;
				testMessage = testMessage + " PASSED.";
			}
			else {
				testMessage = testMessage + " FAILED: " + statement;
				console.log(testMessage);
			}
			self.totalTests += 1;
			self.messages.push(testMessage);
		}

		self.runTests = function() {
			self.testAttributes();
		}

		self.testAttributes = function() {
			var $scope = {};
			self.messages.push("Running UsersController attribute tests...");
			var userTestController = $controller('UsersController', { $scope: $scope });
			userTestController.username = "AlanChristopher";
			self.assert(userTestController.username === "AlanChristopher", userTestController.username + " is not equal to 'AlanChristopher'.");
			userTestController.createDummyUser();
			self.assert(userTestController.currentCity === "Berkeley", userTestController.currentCity + " is not equal to 'Berkeley'.");

		}

	}]);
angular.module('generosity', ['ngRoute', 'templates'])
	.config(['$routeProvider', 
	  	function($routeProvider) {
	    	$routeProvider.
	      		when('/', {

	      		}).
	      		when('/profile', {
	        		templateUrl: "profile.html",
	        		controller: 'UsersController'
	      		}).
	      		when('/challenge', {

	      		}).
	      		when('/map', {

	      		}).	      		
	      		when('/shop', {

	      		}).
	      		// when('/phones/:phoneId', {
	        // 		templateUrl: 'partials/phone-detail.html',
	        // 		controller: 'PhoneDetailCtrl'
	      		// }).
	      		otherwise({
	        		redirectTo: '/'
	      		});
	  }])

	.controller('UsersController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
		var self = this;

		self.username;
		self.realName;
		self.password;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		self.recipient; //Should probably be renamed
		self.description;


		self.errCode = 0;

		self.addUser = function() {
			$http.post('users/add', {username: self.username, password: self.password}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -2) {
						alert("Error: This username already exists.");
						console.log("Error: This username already exists.");
					}
					else if(self.errCode == -3) {
						alert("Error: The username is empty, too long, or has invalid characters.");
						console.log("Error: The username is empty, too long, or has invalid characters.");
					}
					else if(self.errCode == -4) {
						alert("Error: The password is empty, too long, or has invalid characters.");
						console.log("Error: The password is empty, too long, or has invalid characters.");
					}
					else {
						alert("User created.");
						console.log("User created.");						
					}
					console.log(self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -5;
					alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.retrieveErrCode = function(code) {
			$scope.err = code;
			console.log("here");
		};

		self.createDummyUser = function() {
			self.username = "LordChristopher";
			self.realName = "Lord Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
			self.description = "Why thank you for looking at my profile. Joseph will from now on use this page as a sort of bulletin for what's needed. The current wishlist is: -Working logins on the backend - currently, session creation results in a bad hash error. -More robust create() methods in backend controllers - preferably, ones that can just take in JSON objects and fill in all the non-empty parameters (and initialize empty parameters to some default value). -Backend edit() methods for all changeable fields.  -...Fixes for the Heroku issues."
		};

		// self.login = function(name, pw) {

		// };

		// self.logout = function() {

		// };
	}])

	.controller('GiftsController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
		var self = this;

		self.name;
		self.giver;
		self.recipient;
		self.description;
		self.rating;
		self.url;

		self.addGift = function() {
			var errCode;
			$http.post('gifts/create', {name: self.name, url: self.url}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						alert("Error: Invalid gift.");
					}
					else {
						alert("Gift created.");						
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					alert("Error.");
				});
		}

		self.createDummyGift = function() {
			self.name = "Shin Megami Tensei x Fire Emblem";
			self.giver = "Atlus and Intelligent Systems";
			self.recipient = "LordChristopher";
			self.description = "Such hype. Must play. Wow.";
			self.rating = 5.0;
		};
	}])

	.controller('SessionController', ['$scope', '$http', '$rootScope', function($scope, $http, $rootScope) {
		var self = this;

		self.userId;
		self.username;

		self.login = function(username, password) {
			$http.post('login', {username: username, password: password}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					alert("Connected");
					errCode = data.errCode;
					console.log(errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					console.log("error");
					alert("Error.");
				});
		}
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

	.directive('giftForm', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "gift-form.html"
		};
	})

	.directive('loginForm', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "login-form.html"
		};
	})	

	.directive('profile', function() {
		return {
			restrict: 'E',
			scope: {
				username: '@',
				realName: '@',
				availableHours: '@',
				currentCity: '@',
				recipient: '@',
				description: '@',
				reputation: '@'
			},
			templateUrl: "profile.html" //Need to accomodate id afterwards
		};
	})	

	.directive('gift', function() {
		return {
			restrict: 'E',
			scope: {
				name: '@',
				giver: '@',
				recipient: '@',
				description: '@',
				rating: '@'
			},
			templateUrl: "gift.html" //Need to accomodate id afterwards
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

	.directive('giftsTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "gifts-tests.html"
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

	
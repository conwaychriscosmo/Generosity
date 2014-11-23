angular.module('generosity', ['ngRoute', 'ngCookies', 'templates'])
	.config(['$routeProvider', '$locationProvider',
	  	function($routeProvider, $locationProvider) {
	    	$routeProvider.
	      		when('/', {
	      			templateUrl: "index.html"
	      		}).
	      		when('/profile/:id', {
	        		templateUrl: "profile.html",
	        		controller: 'UsersController as profiledUser'
	      		}).
	      		when('/gift/:id', {
	        		templateUrl: "gift.html",
	        		controller: 'GiftsController as profiledGift'
	      		}).
	      		when('/challenge/:code', {
	      			templateUrl: "challenge.html",
	      			controller: 'ChallengesController as receivingUser'
	      		}).
	      		when('/map', {
	      			redirectTo: function() {
        				window.location = "/tracker";
    					}
	      		}).	      		
	      		when('/shop', {
	      			templateUrl: "shop.html"
	      		}).
	      		when('/users-form', {
	        		templateUrl: "users-form.html",
	        		controller: 'UsersController as newUser'
	      		}).
	      		when('/login-form', {
	        		templateUrl: "login-form.html",
	        		controller: 'UsersController as loginUser'
	      		}).
	      		when('/edit-user', {
	        		templateUrl: "edit-users-form.html",
	        		controller: 'UsersController as editedUser'
	      		}).
	      		when('/gifts-form', {
	        		templateUrl: "gift-form.html",
	        		controller: 'GiftsController as newGift'
	      		}).
	      		when('/about', {
	      			templateUrl: "about.html"
	      		}).
	      		when('/contact', {
	      			templateUrl: "contact.html"
	      		}).
	      		when('/tests', {
	      			templateUrl: "tests.html"
	      		}).
	      		otherwise({
	        		redirectTo: '/'
	      		});
	  }])

	.controller('UsersController', ['$scope', '$http', '$rootScope', '$location', '$routeParams', '$cookieStore', function($scope, $http, $rootScope, $location, $routeParams, $cookieStore) {
		var self = this;

		$scope.id;			//Top secret! Don't use these variables without the dictator's permission!
		$scope.username;
		$scope.canEdit;

		self.id;
		self.username;
		self.realName;
		self.password;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		self.recipient; //Should probably be renamed
		self.description;
		self.reputation;
		self.profileUrl;

		self.errCode = 0;

		self.getUserFromCookie = function() {
			var sessionCookie = $cookieStore.get('session');
			console.log("YOLO");
			if(!sessionCookie) {
				return;
			}
			// console.log(self.sessionCookie);
			$rootScope.id = sessionCookie["id"];
			$rootScope.username = sessionCookie["username"];
		}

		self.checkIfLoggedInUser = function() {
			$scope.canEdit = self.id == $rootScope.id;
		}

		self.getCurrentScopeUserFromCookie = function() {
			var sessionCookie = $cookieStore.get('session');
			console.log("YOLO");
			if(!sessionCookie) {
				return;
			}
			// console.log(self.sessionCookie);
			self.id = sessionCookie["id"];
			self.username = sessionCookie["username"];
		}

		self.getUserFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getUserById(self.id);
		}

		self.getUserById = function(targetId) {
			// console.log(targetId);
			if(targetId == -13) { //Use a user spoof
				self.createDummyUser();
				return;
			}
			$http.post('users/search', {id: targetId}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					console.log(usersList);
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					console.log(foundUser["username"]);
					self.username = foundUser["username"];
					self.realName = foundUser["real_name"];
					self.availableHours = foundUser["available_hours"];
					self.currentCity = foundUser["current_city"];
					self.currentLocation = foundUser["current_location"];
					self.reputation = foundUser["score"];
					self.bio = foundUser["description"];
					self.profileUrl = foundUser["profile_url"];
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.makeCookie = function(uId, uName) {
			var myCookie = {};
			myCookie["id"] = self.id;
			myCookie["username"] = self.username;
			$cookieStore.put('session', myCookie);
		}

		self.loadUserData = function(targetUsername, purpose) {
			// console.log(targetUsername);
			$http.post('users/search', {username: targetUsername}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					console.log(usersList);
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					self.id = foundUser["id"];
					self.username = foundUser["username"]; //Technically redundant
					self.makeCookie(self.id, self.name);
					console.log(self.id);

					sessionCookie = $cookieStore.get('session');
					// $rootScope.getUserFromCookie();
					$rootScope.id = sessionCookie["id"];
					$rootScope.username = sessionCookie["username"];
					console.log(sessionCookie);
					if(purpose === 'login') {
						rUrl = '/profile/' + $rootScope.id;
						console.log(rUrl);
						console.log($rootScope.id);
						$location.path(rUrl);
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.addUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$scope.message = "";
			$http.post('users/add', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				description: self.bio, sprofile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -2) {
						// alert("Error: This username already exists.");
						console.log("Error: This username already exists.");
						$scope.message = "Error: This username already exists.";
					}
					else if(self.errCode == -3) {
						// alert("Error: The username is empty, too long, or has invalid characters.");
						console.log("Error: The username is empty, too long, or has invalid characters.");
						$scope.message = "Error: The username is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -4) {
						// alert("Error: The password is empty, too long, or has invalid characters.");
						console.log("Error: The password is empty, too long/too short, or has invalid characters.");
						$scope.message = "Error: The password is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
						console.log("Error: The real name is empty, too long, or has invalid characters.");
						$scope.message = "As real names are no longer required, this branch should never execute.";
					}
					else {
						// alert("User created.");
						console.log("User created.");	
						self.loadUserData(self.username, 'login');
					}
					console.log(self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.editUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$scope.message = "";
			$http.post('users/edit', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				profile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
						console.log("Error: The real name is empty, too long, or has invalid characters.");
						$scope.message = "As real names are no longer required, this branch should never execute.";
					}
					else {
						// alert("User created.");
						console.log("User created.");	
						self.loadUserData(self.username, 'login');
					}
					console.log(self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					// alert("Error.");
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		}

		self.createDummyUser = function() {
			self.username = "LordChristopher";
			self.realName = "Lord Christopher";
			self.password = "Team 61C";
			self.availableHours = "6 to 11 pm";
			self.currentCity = "Berkeley";
			self.currentLocation = "Nowhere";
			self.recipient = "He whose name shall not be spoken";
			self.reputation = 13;
			self.description = "Paul is the biggest troll.";
			self.profileUrl = "http://static.tumblr.com/isuwdsr/EBVlzsy8r/chris_redfield_avatar_by_ryann1220-d36hj2c.jpg";
		};

		self.makeIter = function(l) {
			var f = [];
			var i;
			for(i = 0; i < l; i++) {
				f[i] = i;
			}
			self.iter = f;
		};

		self.makeIter(5);

		self.login = function(name, pw) {
			$scope.message = "";
			$http.post('login', {username: name, password: pw}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					self.errCode = data.errCode;
					if(self.errCode == -1) {
						// alert("Login failed.");
						console.log("Login failed.");
						$scope.message = "The username and password do not match.";
					}
					else {
						// alert("Login succeeded.");
						console.log("Login succeeded.");
						self.password = "";
						self.loadUserData(self.username, 'login');
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					console.log("Error.");
				}).
				then(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					// alert("Done.");
					console.log("Done.");
					return;
				});
		};

		self.logout = function() {
			$cookieStore.remove('session');
			$rootScope.id = 0;
			$rootScope.username = 0;
			console.log("Logged out.");
		};

		self.deleteAll = function() {

		};
	}])

	.controller('GiftsController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams) {
		var self = this;

		self.name;
		self.giver;
		self.recipient;
		self.description;
		self.rating;
		self.imageUrl;

		self.addGift = function() {
			var errCode;
			$scope.message = "";
			$http.post('gifts/create', {name: self.name, url: self.url}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						$scope.message = "Error: Invalid gift.";
					}
					else {
						console.log("Gift created.");						
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		};

		self.getGiftFromUrlParams = function() {
			self.id = $routeParams.id;
			// console.log(self.id);
			self.getGiftById(self.id);
		}

		self.getGiftById = function(targetId) {
			// console.log(targetId);
			if(targetId == 0) { //Use a user spoof
				self.createDummyGift();
				return;
			}
			// $http.post('users/search', {id: targetId}).
			// 	success(function(data, status, headers, config) {
			// 	// this callback will be called asynchronously
			// 	// when the response is available
			// 		// self.errCode = data.errCode;
			// 		var usersList = data["users"];
			// 		console.log(usersList);
			// 		if(usersList.length != 1) {
			// 			// alert("Error: User not found.");
			// 			console.log("Error: User not found.");
			// 			$location.path('/');
			// 			return;
			// 		}
			// 		var foundUser = usersList[0];
			// 		console.log(foundUser["username"]);
			// 		self.username = foundUser["username"];
			// 		self.realName = foundUser["real_name"];
			// 		self.availableHours = foundUser["available_hours"];
			// 		self.currentCity = foundUser["current_city"];
			// 		self.currentLocation = foundUser["current_location"];
			// 		self.reputation = foundUser["score"];
			// 		// self.description = foundUser["description"];
			// 		self.profileUrl = foundUser["profile_url"];
			// 	}).
			// 	error(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		self.errCode = -99;
			// 		// alert("Error.");
			// 		console.log("Error.");
			// 	}).
			// 	then(function(data, status, headers, config) {
			// 	// called asynchronously if an error occurs
			// 	// or server returns response with an error status.
			// 		// alert("Done.");
			// 		console.log("Done.");
			// 		return;
			// 	});
		}

		self.createDummyGift = function() {
			self.name = "Shin Megami Tensei x Fire Emblem";
			self.giver = "Atlus and Intelligent Systems";
			self.recipient = "LordChristopher";
			self.description = "Such hype. Must play. Wow.";
			self.rating = 5.0;
			self.imageUrl="http://i1290.photobucket.com/albums/b531/orangepikmin333/shittypaintjob_zpscbf470a8.jpg";
		};
	}])
	
	.controller('ChallengesController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams) {
		var self = this;

		self.giverId;
		self.hasCurrentChallenge;
		self.onQueue;

		self.giver;
		self.recipient;
		self.description;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;

		self.addChallenge = function() {
			var errCode;
			$scope.message = "";
			self.giverId = $rootScope.id;
			$http.post('challenge/match', { id: self.giverId }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.message = "Error: There is currently no one available. Please try again later.";
					}
					else {
						console.log("Challenge created.");	
						self.hasCurrentChallenge = true;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		};

		self.getChallengeForCurrentUser = function() {
			// console.log(self.id);
			self.code = $routeParams.code;
			console.log("foo");
			self.hasCurrentChallenge = false;
			$scope.message = "";
			if(self.code == -1) {
				self.createDummyChallenge();
				self.hasCurrentChallenge = true;
				return;
			}
			self.giverId = $rootScope.id;
			$http.get('challenge/getCurrentChallenge', { id: self.giverId }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.message = "You currently do not have a challenge.";
					}
					else {
						console.log("Challenge created.");	
						$scope.message = "";
						self.hasCurrentChallenge = true;					
					}
					console.log(errCode);
					console.log($scope.message);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		}

		self.checkIfOnQueue = function() { //Check to see if the logged in user is currently a receiver candidate.
			self.receiverUsername = $rootScope.username;
			$http.get('challenge/onQueue', { username: self.receiverUsername }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.message = "You are currently on the queue.";
						self.onQueue = true;
					}
					else {
						console.log("You are currently not on the queue.");	
						$scope.message = "";
						self.onQueue = false;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		}

		self.joinQueue = function() {
			if(self.onQueue) {
				$scope.message = "You are already on the queue.";
				return;
			}
			self.receiverId = $rootScope.id;
			$http.post('challenge/joinQueue', { id: self.receiverId }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.message = "You currently do not have a challenge.";
					}
					else {
						console.log("Challenge created.");	
						$scope.message = "You are currently on the queue.";
						self.hasCurrentChallenge = true;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.message = "Error: There appears to be an issue with the server. Please try again later.";
				});
		}

		self.createDummyChallenge = function() {
			self.giver = "LordChristopher";
			self.recipient = "LordKittenz";
			self.reputation = 13
			self.bio = "lul ok qq";
			self.availableHours = "6pm-6am"; 
			self.currentCity = "Berkeley, California";
			self.currentLocation = "Nowhere";
		};
	}])

	.directive('navbar', function() {
		return {
			restrict: 'E',
			templateUrl: "navbar.html"
		};
	})

	.directive('footbar', function() {
		return {
			restrict: 'E',
			templateUrl: "footbar.html"
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

	.directive('challengesTests', function() {
		return {
			restrict: 'E',
			scope: {

			},
			templateUrl: "challenges-tests.html"
		};
	})
	
	.directive('testStatus', function() {
		return {
			restrict: 'C',
			scope: {
			  message: '@'
			},
			link: function(scope, element, attrs) { 
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

	
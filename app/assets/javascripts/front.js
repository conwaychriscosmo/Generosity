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
			if(!sessionCookie) {
				return;
			}
			$rootScope.id = sessionCookie["id"];
			$rootScope.username = sessionCookie["username"];
		}

		self.checkIfLoggedInUser = function() {
			$scope.canEdit = self.id == $rootScope.id;
			if ($rootScope.id != null) {
				console.log("Asicled")
				navigator.geolocation.getCurrentPosition(showPosition)
				function showPosition(position) {
    			var loc = position.coords.latitude + " " + position.coords.longitude
    			$http.post('users/setLocation', {user_id: $rootScope.id, location: loc})
			}
			}
		}

		self.getCurrentScopeUserFromCookie = function() {
			var sessionCookie = $cookieStore.get('session');
			if(!sessionCookie) {
				return;
			}
			self.id = sessionCookie["id"];
			self.username = sessionCookie["username"];
		}

		self.getUserFromUrlParams = function() {
			self.id = $routeParams.id;
			self.getUserById(self.id);
		}

		self.getUserById = function(targetId) {
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
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					self.username = foundUser["username"];
					self.realName = foundUser["real_name"];
					self.availableHours = foundUser["available_hours"];
					self.currentCity = foundUser["current_city"];
					self.currentLocation = foundUser["current_location"];
					self.reputation = foundUser["score"];
					self.bio = foundUser["description"];
					self.profileUrl = foundUser["profile_url"];
					if(self.testing) {
						return;
					}
					self.getAllGiftsByGiverUsername();
					self.getAllGiftsByRecipientUsername();
					// console.log(self.givenGifts);
					// console.log(self.receivedGifts);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.getUserByUsername = function(targetUsername) {
			$http.post('users/search', {username: targetUsername}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
					if(usersList.length != 1) {
						// alert("Error: User not found.");
						console.log("Error: User not found.");
						$location.path('/');
						return;
					}
					var foundUser = usersList[0];
					self.id = foundUser["id"];
					self.username = foundUser["username"];
					self.realName = foundUser["real_name"];
					self.availableHours = foundUser["available_hours"];
					self.currentCity = foundUser["current_city"];
					self.currentLocation = foundUser["current_location"];
					self.reputation = foundUser["score"];
					self.bio = foundUser["description"];
					self.profileUrl = foundUser["profile_url"];
					if(self.testing) {
						return;
					}
					self.getAllGiftsByGiverUsername();
					self.getAllGiftsByRecipientUsername();
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.makeCookie = function(uId, uName) {
			var myCookie = {};
			myCookie["id"] = self.id;
			myCookie["username"] = self.username;
			$cookieStore.put('session', myCookie);
		}

		self.loadUserData = function(targetUsername, purpose) {
			$http.post('users/search', {username: targetUsername}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					var usersList = data["users"];
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

					sessionCookie = $cookieStore.get('session');
					// $rootScope.getUserFromCookie();
					$rootScope.id = sessionCookie["id"];
					document.cookie = "user_id=" + $rootScope.id
					$rootScope.username = sessionCookie["username"];
					if(purpose === 'login') {
						if(self.testing) {
							return;
						}
						rUrl = '/profile/' + $rootScope.id;
						$location.path(rUrl);
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.addUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$scope.message = "";
			$http.post('users/add', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				description: self.bio, profile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -2) {
						// alert("Error: This username already exists.");
						$scope.message = "Error: This username already exists.";
					}
					else if(self.errCode == -3) {
						// alert("Error: The username is empty, too long, or has invalid characters.");
						$scope.message = "Error: The username is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -4) {
						// alert("Error: The password is empty, too long, or has invalid characters.");
						$scope.message = "Error: The password is empty, too long, or has invalid characters.";
					}
					else if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
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
				});
		}

		self.editUser = function() {
			// alert("YO DAWG"); //Only called once even when things go awry
			$scope.message = "";
			$http.post('users/edit', {username: self.username, password: self.password, real_name: self.realName, 
				available_hours: self.availableHours, current_city: self.currentCity, current_location: self.currentLocation, 
				description: self.bio, profile_url: self.profileUrl}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					self.errCode = data.errCode;
					if(self.errCode == -6) {
						// alert("Error: The real name is empty, too long, or has invalid characters.");
						$scope.message = "As real names are no longer required, this branch should never execute.";
					}
					else {
						// alert("User created.");
						console.log("User edited.");	
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


	self.getAllGiftsByGiverUsername = function() {
			$http.post('gifts/find_all_gifts_by_giver', {username: self.username}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					if(data['errCode'] == -16) {
						console.log("This user has given no gifts.");
						return;
					}
					console.log("data below");
					console.log(data);
					self.givenGifts = data;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.getAllGiftsByRecipientUsername = function() {
			$http.post('gifts/find_all_gifts_by_recipient', {username: self.username}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					if(data['errCode'] == -17) {
						console.log("This user has no received gifts.");
						return;
					}
					console.log("data below");
					console.log(data);
					self.receivedGifts = data;
					for(var i=0; i<self.receivedGifts.length; i++) {
						self.receivedGifts[i].receiving = true;
					}
					console.log(data);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					console.log("Error.");
				});
		}

		self.login = function(name, pw) {
			$http.post('gifts/find_all_gifts_by_recipient', {username: self.username}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					if(data['errCode'] == -1) {
						console.log("This user has no received gifts.");
						return;
					}
					console.log("data below");
					console.log(data);
					self.receivedGifts = data;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					console.log("Error.");
				});
			$scope.message = "";
			$http.post('login', {username: name, password: pw}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					self.errCode = data.errCode;
					if(self.errCode == -1) {
						$scope.message = "The username and password do not match.";
					}
					else {
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
				});
		};

		self.logout = function() {
			$cookieStore.remove('session');
			$rootScope.id = 0;
			$rootScope.username = 0;
			console.log("Logged out.");
		};

		self.deleteAll = function() {
			$scope.message = "";
			$http.post('users/purge', {}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					self.errCode = data.errCode;
					if(self.errCode < 0) {
						// alert("Login failed.");
						console.log("Purge failed.");
						$scope.message = "The purge has failed.";
					}
					else {
						// alert("Login succeeded.");
						console.log("No signs of life remain.");
						$scope.message = "No signs of life remain.";
					}
					console.log("Purge errCode: "+ self.errCode);
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					$scope.message = "The server appears to be having issues. Please try again later.";
					console.log("Error.");
				});
		};
	}])

	.controller('GiftsController', ['$scope', '$http', '$rootScope', '$routeParams', '$location', function($scope, $http, $rootScope, $routeParams, $location) {
		var self = this;

		self.name;
		self.giver;
		self.recipient;
		self.bio;
		self.rating;
		self.imageUrl;

		self.addGift = function() {
			var errCode;
			$scope.message = "";
			
			$http.post('gifts/create', {name: self.name, url: self.imageUrl, bio: self.bio, giver: $rootScope.id}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -2) {
						$scope.message = "Error: There is no giver.";
					}
					else if(errCode == -3) {
						$scope.message = "Error: The gift is blank.";
					}
					else if(errCode == -4) {
						$scope.message = "Error: There is an issue with completing the challenge.";
					}
					else if(errCode == -5) {
						$scope.message = "Error: The gift is nil.";
					}
					else if(errCode == -6) {
						$scope.message = "Error: There is no recipient.";
					}
					else if(errCode == -7) {
						$scope.message = "Error: You don't have a challenge.";
					}
					else if(errCode == -8) {
						$scope.message = "Error: You need to give the gift a name!";
					}
					else if(errCode == -9) {
						$scope.message = "Error: The gift failed to save.";
					}
					else if(errCode == -10) {
						$scope.message = "Error: The gift is invalid.";
					}
					else {
						alert("Gift Created!")
						var rUrl = '/profile/' + $rootScope.id;
						$location.path(rUrl);
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
			$http.post('gifts/find_gift', {id: targetId}).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					console.log(data);
					// var foundGift = data["gifts"];
					var foundGift = data;
					// console.log(giftsList);
					if(!foundGift) {
						// alert("Error: User not found.");
						console.log("Error: Gift not found.");
						// $location.path('/');
						return;
					}
					self.name = foundGift.name;
					self.giver = foundGift.giver;
					self.recipient = foundGift.recipient;
					self.bio = foundGift.description;
					self.review = foundGift.review;
					self.rating = foundGift.rating;
					self.imageUrl = foundGift.url;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.writeReview = function() {
			// console.log(targetId);
			$http.post('gifts/rateReview', {user_id: $rootScope.id, gift_id: self.id, review: self.review, rating: self.rating }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					// self.errCode = data.errCode;
					console.log(data);
					// var foundGift = data["gifts"];
					var errCode = data.errCode;
					// console.log(giftsList);
					if(errCode == 1) {
						console.log("wtf");
						self.reviewed = true;
						self.message = "Gift successfully rated!";
						return;
					}
					else {
						self.message = "Both fields are required.";
					}

					// self.imageUrl = foundGift.url;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					self.errCode = -99;
					// alert("Error.");
					console.log("Error.");
				});
		}

		self.createDummyGift = function() {
			self.name = "Shin Megami Tensei x Fire Emblem";
			self.giver = "Atlus and Intelligent Systems";
			self.recipient = "LordChristopher";
			self.bio = "Such hype. Must play. Wow.";
			self.rating = 5.0;
			self.imageUrl="http://i1290.photobucket.com/albums/b531/orangepikmin333/shittypaintjob_zpscbf470a8.jpg";
		};
	}])
	
	.controller('ChallengesController', ['$scope', '$http', '$rootScope', '$routeParams', function($scope, $http, $rootScope, $routeParams) {
		var self = this;

		$scope.queueMessage;
		$scope.challengeMessage;

		self.giverId;
		self.hasCurrentChallenge;
		self.onQueue;

		self.giver;
		self.recipient;
		self.description;
		self.availableHours; //How should this be styled?
		self.currentCity;
		self.currentLocation;
		self.reputation;

		self.addChallenge = function() {
			var errCode;
			// $scope.challengeMessage = "";
			self.giverId = $rootScope.id;
			$http.post('challenge/match', { id: self.giverId }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode != 1) {
						//This should later be changed to put this person on a queue.
						$scope.challengeMessage = "Challenge Error: There is currently no one available. Please try again later.";
					}
					else {
						console.log("Challenge created.");	
						self.getChallengeForCurrentUser();
						self.hasCurrentChallenge = true;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.challengeMessage = "Challenge Error: There appears to be an issue with the server. Please try again later.";
				});
		};

		self.getChallengeForCurrentUser = function() {
			self.code = $routeParams.code;
			self.hasCurrentChallenge = false;
			$scope.challengeMessage = "";
			if(self.code == -1) {
				self.createDummyChallenge();
				self.hasCurrentChallenge = true;
				return;
			}
			self.giverId = $rootScope.id;
			self.giver = $rootScope.username;
			$http.post('challenge/getCurrentChallenge', { id: self.giverId, username: self.giver }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode != 1) {
						//This should later be changed to put this person on a queue.
						$scope.challengeMessage = "You currently do not have a challenge.";
					}
					else {
						console.log("Challenge retrieved.");
						console.log(data);
						$scope.challengeMessage = "";
						self.reciever = data.Recipient;
						self.imageUrl = data.imageUrl
						self.hasCurrentChallenge = true;	
						self.description = data.description;
						self.availableHours = data.availableHours;
						self.currentCity = data.currentCity;
						self.currentLocation = data.currentLocation;
						self.reputation = data.reputation;
					}
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.challengeMessage = "Challenge Error: There appears to be an issue with the server. Please try again later.";
				});
		}

		self.checkIfOnQueue = function() { //Check to see if the logged in user is currently a recipient candidate.
			self.recipient = $rootScope.username;
			console.log("foo " + self.recipient);
			// $scope.queueMessage = "";
			$http.post('challenge/onQueue', { username: self.recipient }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.queueMessage = "You are currently on the queue.";
						self.onQueue = true;
					}
					else {
						$scope.queueMessage = "You are currently not on the queue.";
						self.onQueue = false;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.queueMessage = "Queue Error: There appears to be an issue with the server. Please try again later.";
				});
		}

		self.joinQueue = function() {
			if(!self.giver) {
				$scope.queueMessage = "You need to be logged in to join the queue."
				console.log("HERE");
				return;
			}
			if(self.onQueue) {
				$scope.queueMessage = "You are already on the queue.";
				return;
			}
			self.recipientId = $rootScope.id;
			self.recipient = $rootScope.username;
			$http.post('challenge/joinQueue', { username: self.recipient }).
				success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
					var errCode = data.errCode;
					/*We need actual error codes for this.*/
					if(errCode == -1) {
						//This should later be changed to put this person on a queue.
						$scope.queueMessage = "You currently do not have a challenge.";
					}
					else {
						console.log("Queue joined.");	
						$scope.queueMessage = "You are currently on the queue.";
						self.onQueue = true;					
					}
					console.log(errCode);
					// $rootScope.errCode = data.errCode;
				}).
				error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
					$scope.queueMessage = "Queue Error: There appears to be an issue with the server. Please try again later.";
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

	.directive('giftListElement', function() {
		return {
			restrict: 'E',
			templateUrl: "gift-list-element.html"
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

	
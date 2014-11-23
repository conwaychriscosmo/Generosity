angular.module('generosity').controller('ChallengeTestController', ['$scope', '$http', '$controller', function($scope, $http, $controller) {
		var self = this;
		// var expect = chai.expect;
		// var expect = require('expect.js');

		self.totalTests = 0;
		self.passedTests = 0;
		self.sectionTests = 0;
		self.messages = [];

		self.assert = function(condition, statement) {
			testMessage = "Test #" + (self.totalTests+1);
			if(condition) {
				self.passedTests += 1;
				testMessage = testMessage + " PASSED: " + statement;
			}
			else {
				testMessage = testMessage + " FAILED: " + statement;
				console.log(testMessage);
			}
			self.totalTests += 1;
			self.sectionTests += 1;
			self.messages.push(testMessage);
		}

		self.runTests = function() {
			self.testAttributes();
			// self.testAPICalls();
		}

		/*testAttributes() tests the UsersController's variables and variable-related methods.*/
		self.testAttributes = function() {
			var $scope = {};
			self.sectionTests = 0;
			self.messages.push("Running ChallengesController attribute tests...");
			var challengeTestController = $controller('ChallengesController', { $scope: $scope });
			challengeTestController.giver = "Meester";
			self.assert(challengeTestController.giver === "Meester", "Giver is " + challengeTestController.giver + ", and should be equal to 'Meester'.");
			challengeTestController.createDummyChallenge();
			self.assert(challengeTestController.giver === "LordChristopher", "Giver is " + challengeTestController.giver + ", and should be equal to 'LordChristopher'.");
			self.assert(challengeTestController.recipient === "LordKittenz", "Recipient is " + challengeTestController.recipient + ", and should be equal to 'LordKittenz'.");
			self.assert(challengeTestController.reputation === 13, "The recipient's reputation is " + challengeTestController.reputation + ", and should be equal to 13.");
			self.assert(challengeTestController.bio === "lul ok qq", "The recipient's bio is " + challengeTestController.bio + ", and should be equal to 'lul ok qq'.");
			self.assert(challengeTestController.availableHours === '6pm-6am', "The recipient's available hours are " + challengeTestController.availableHours + ", and should be equal to '6pm-6am'.");
			self.assert(challengeTestController.currentCity === 'Berkeley, California', "The recipient's current city is " + challengeTestController.currentCity + ", and should be equal to 'Berkeley, California'.");
			self.assert(challengeTestController.currentLocation === 'Nowhere', "The recipient's current location is " + challengeTestController.currentLocation + ", and should be equal to 'Nowhere'.");
		}

		// self.testAPICalls = function() {
		// 	var $scope = {};
		// 	self.sectionTests = 0;
		// 	self.messages.push("Running UsersController API call tests...");
		// 	var challengeTestController = $controller('UsersController', { $scope: $scope });
		// 	challengeTestController.createDummyUser();
		// 	var errCode = challengeTestController.addUser();
		// 	// console.log("yolo");
		// 	// console.log(errCode);
		// 	/*Add code to delete this user beforehand.*/
		// 	errCode = $scope.err;
		// 	self.assert(errCode === 1, "Error code is " + errCode + ", but it should have been 1 (successful creation).");
		// 	errCode = challengeTestController.addUser();
		// 	self.assert(errCode === -2, "Error code is " + errCode + ", but it should have been -2 (username already exists). Username is " + challengeTestController.username + ", but it should have been LordChristopher.");
		// 	challengeTestController.username = "";
		// 	errCode = challengeTestController.addUser();
		// 	self.assert(errCode === -3, "Error code is " + errCode + ", but it should have been -3 (bad username). Username is " + challengeTestController.username + ", but it should have been blank.");
		// 	challengeTestController.username = "Anaconda";
		// 	challengeTestController.password = null;
		// 	errCode = challengeTestController.addUser();
		// 	self.assert(errCode === -4, "Error code is " + errCode + ", but it should have been -4 (bad password). Password is " + challengeTestController.password + ", but it should have been blank.");
		// }
	}]);
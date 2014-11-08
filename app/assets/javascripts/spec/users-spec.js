angular.module('generosity').controller('UserTestController', ['$scope', '$http', '$controller', function($scope, $http, $controller) {
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
			self.testAPICalls();
		}

		/*testAttributes() tests the UsersController's variables and variable-related methods.*/
		self.testAttributes = function() {
			var $scope = {};
			self.sectionTests = 0;
			self.messages.push("Running UsersController attribute tests...");
			var userTestController = $controller('UsersController', { $scope: $scope });
			userTestController.username = "CountNecula";
			self.assert(userTestController.username === "CountNecula", "Username is " + userTestController.username + ", and should be equal to 'CountNecula'.");
			userTestController.createDummyUser();
			self.assert(userTestController.username === "LordChristopher", "Username is " + userTestController.username + ", and should be equal to 'LordChristopher'.");
			self.assert(userTestController.realName === "Lord Christopher", "Real name is " + userTestController.realName + ", and should be equal to 'Lord Christopher'.");
			self.assert(userTestController.password === "Team 61C", "Password is " + userTestController.password + ", and should be equal to 'Team 61C'.");
			self.assert(userTestController.availableHours === "6 to 11 pm", "Available hours are " + userTestController.availableHours + ", and should be equal to '6 to 11 pm'.");
			self.assert(userTestController.currentCity === "Berkeley", "Current location is " + userTestController.currentCity + ", and should be equal to 'Berkeley'.");
			self.assert(userTestController.currentLocation === "Nowhere", "Current location is " + userTestController.currentLocation + ", and should be not equal to 'Nowhere'.");
			self.assert(userTestController.recipient === "He whose name shall not be spoken", "Recipient is " + userTestController.recipient + ", and should be equal to 'He whose name shall not be spoken'.");
			setTimeout(function() {
				console.log("Testing timeouts.");
			}, 2000);
		}

		self.testAPICalls = function() {
			var $scope = {};
			self.sectionTests = 0;
			self.messages.push("Running UsersController API call tests...");
			var userTestController = $controller('UsersController', { $scope: $scope });
			userTestController.createDummyUser();
			userTestController.addUser();
			// console.log("yolo");
			// console.log(errCode);
			/*Add code to delete this user beforehand.*/
			// errCode = $scope.err;
			setTimeout(function() {
				self.assert(userTestController.errCode === 1, "Error code is " + userTestController.errCode + ", but it should have been 1 (successful creation).");
			}, 1000);
			setTimeout(function() {
				userTestController.addUser();
			}, 1100);
			setTimeout(function() {
				self.assert(userTestController.errCode === -2, "Error code is " + userTestController.errCode + ", and it should be -2 (username already exists). Username is " + userTestController.username + ", and it should be LordChristopher.");
			}, 2100);
			setTimeout(function() {
				userTestController.username = "";
			}, 2200);
			setTimeout(function() {
				userTestController.addUser();
			}, 2300);
			setTimeout(function() {
				self.assert(userTestController.errCode === -3, "Error code is " + userTestController.errCode + ", and it should have been -3 (bad username). Username is " + userTestController.username + ", and it should be blank.");
			}, 3300);
			setTimeout(function() {
				userTestController.username = "Anaconda";
			}, 3400);
			setTimeout(function() {
				userTestController.password = null;
			}, 3500);
			setTimeout(function() {
				userTestController.addUser();
			}, 3600);
			setTimeout(function() {
				self.assert(userTestController.errCode === -4, "Error code is " + userTestController.errCode + ", and it should be -4 (bad password). Password is " + userTestController.password + ", but it should be blank.");
			}, 4600);
		}
	}]);
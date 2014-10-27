angular.module('generosity').controller('GiftTestController', ['$scope', '$http', '$controller', function($scope, $http, $controller) {
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
			self.messages.push("Running GiftsController attribute tests...");
			var giftTestController = $controller('GiftsController', { $scope: $scope });
			giftTestController.name = "Candy";
			self.assert(giftTestController.name === "Candy", "Name is " + giftTestController.name + ", and should be equal to 'Candy'.");
			giftTestController.createDummyGift();
			self.assert(giftTestController.name === "Shin Megami Tensei x Fire Emblem", "Name is " + giftTestController.name + ", and should be equal to 'Shin Megami Tensei x Fire Emblem'.");
			self.assert(giftTestController.giver === "Atlus and Intelligent Systems", "Giver is " + giftTestController.giver + ", and should be equal to 'Atlus and Intelligent Systems'.");
			self.assert(giftTestController.recipient === "LordChristopher", "Recipient is " + giftTestController.recipient + ", and should be equal to 'LordChristopher'.");
			self.assert(giftTestController.description === "Such hype. Must play. Wow.", "Description is " + giftTestController.description + ", and should be equal to 'Such hype. Must play. Wow.'.");
			self.assert(giftTestController.rating === 5.0, "Rating is " + giftTestController.rating + ", and should be equal to 5.0.");
		}

		// self.testAPICalls = function() {
		// 	var $scope = {};
		// 	self.sectionTests = 0;
		// 	self.messages.push("Running UsersController API call tests...");
		// 	var giftTestController = $controller('UsersController', { $scope: $scope });
		// 	giftTestController.createDummyUser();
		// 	var errCode = giftTestController.addUser();
		// 	// console.log("yolo");
		// 	// console.log(errCode);
		// 	/*Add code to delete this user beforehand.*/
		// 	errCode = $scope.err;
		// 	self.assert(errCode === 1, "Error code is " + errCode + ", but it should have been 1 (successful creation).");
		// 	errCode = giftTestController.addUser();
		// 	self.assert(errCode === -2, "Error code is " + errCode + ", but it should have been -2 (username already exists). Username is " + giftTestController.username + ", but it should have been LordChristopher.");
		// 	giftTestController.username = "";
		// 	errCode = giftTestController.addUser();
		// 	self.assert(errCode === -3, "Error code is " + errCode + ", but it should have been -3 (bad username). Username is " + giftTestController.username + ", but it should have been blank.");
		// 	giftTestController.username = "Anaconda";
		// 	giftTestController.password = null;
		// 	errCode = giftTestController.addUser();
		// 	self.assert(errCode === -4, "Error code is " + errCode + ", but it should have been -4 (bad password). Password is " + giftTestController.password + ", but it should have been blank.");
		// }
	}]);
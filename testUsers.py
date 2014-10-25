

import unittest
import os
import testLib

class TestUnit(testLib.RestTestCase):
    """Issue a REST API request to run the unit tests, and analyze the result"""
    def testUnit(self):
        respData = self.makeRequest("TEST/users/unitTests", method="POST")
        self.assertTrue('output' in respData)
        print ("Unit tests output:\n"+
               "\n***** ".join(respData['output'].split("\n")))
        self.assertTrue('totalTests' in respData)
        print "***** Reported "+str(respData['totalTests'])+" unit tests. nrFailed="+str(respData['nrFailed'])
        self.assertEquals(0, respData['nrFailed'])



class TestCommands(testLib.RestTestCase):
    """Test adding users, logins, etc."""

    def assertResponse(self, respData, errCode = testLib.RestTestCase.SUCCESS, challengeCode = -1):
        """
        Check that the response data dictionary matches the expected values
        """
        if errCode == 1:
            expected = { 'errCode' : errCode, 'challengeCode' : challengeCode }
        else:
            expected = { 'errCode' : errCode }
        self.assertDictEqual(expected, respData)


    def testAddUser1(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData)

    def testAddUser2(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_USER_EXISTS)

    def testAddUser3(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'a'*129, 'password' : 'password'} )
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)

    def testAddUser4(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : '', 'password' : 'password'} )
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_BAD_USERNAME)

    def testAddUser5(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'a'*129} )
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_BAD_PASSWORD)

    def testAddUser6(self):
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'a'*5} )
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_BAD_PASSWORD)

    def testAddUser7(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/users/add", method="POST", data = { 'username' : 'user2', 'password' : 'password'} )
        self.assertResponse(respData, challengeCode == 1)

    def testLogin1(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("login", method="POST", data = { 'username' : 'user1', 'password' : 'password'})
        self.assertResponse(respData, errCode = testLib.RestTestCase.SUCCESS)

    def testLogin2(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("login", method="POST", data = { 'username' : 'user1', 'password' : 'PASSWORD'})
        self.assertResponse(respData, errCode = testLib.RestTestCase.ERR_BAD_CREDENTIALS)    









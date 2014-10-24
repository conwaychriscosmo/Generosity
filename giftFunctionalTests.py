
#FIXME

import unittest
import os
import testLib

class TestUnit(testLib.RestTestCase):
    """Issue a REST API request to run the unit tests, and analyze the result"""
    def testUnit(self):
        respData = self.makeRequest("/TESTAPI/unitTests", method="POST")
        self.assertTrue('output' in respData)
        print ("Unit tests output:\n"+
               "\n***** ".join(respData['output'].split("\n")))
        self.assertTrue('totalTests' in respData)
        print "***** Reported "+str(respData['totalTests'])+" unit tests. nrFailed="+str(respData['nrFailed'])
        # When we test the actual project, we require at least 10 unit tests
        minimumTests = 10
        if "SAMPLE_APP" in os.environ:
            minimumTests = 4
        self.assertTrue(respData['totalTests'] >= minimumTests,
                        "at least "+str(minimumTests)+" unit tests. Found only "+str(respData['totalTests'])+". use SAMPLE_APP=1 if this is the sample app")
        self.assertEquals(0, respData['nrFailed'])



class TestCommands(testLib.RestTestCase):
    """Test adding users, logins, etc."""

    def assertResponse(self, respData, errCode = 1, Name = None , url = None):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if Name is not None:
            expected['Giver']  = Giver
        if url is not None:
            expected['Recipient'] = Recipient
        self.assertDictEqual(expected, respData)
    
    def testGifte(self):
        respData = self.makeRequest("/gift/create", method="POST", data = { 'Name': 'user1', 'url' : 'hero.com' })
        self.assertResponse(respData, errCode = 1)

    def testChallenge1User(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/challenge/create", method="POST", data = { 'username': 'user1' })
        self.assertResponse(respData, errCode = -1)
    
    def testChallenge2Users(self):
        self.makeRequest("/users/add", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        self.makeRequest("/users/add", method="POST", data = { 'username': 'user2', 'password' : 'password'})
        respData = self.makeRequest("/challenge/create", method="POST", data = { 'username': 'user1' })
        self.assertResponse(respData, errCode = 1, Giver = 'user1', Recipient = 'user2')






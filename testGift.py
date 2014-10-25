
#FIXME

import unittest
import os
import testLib

class TestUnit(testLib.RestTestCase):
    """Issue a REST API request to run the unit tests, and analyze the result"""
    def testUnit(self):
        respData = self.makeRequest("TEST/gifts/unitTests", method="POST")
        self.assertTrue('output' in respData)
        print ("Unit tests output:\n"+
               "\n***** ".join(respData['output'].split("\n")))
        self.assertTrue('totalTests' in respData)
        print "***** Reported "+str(respData['totalTests'])+" unit tests. nrFailed="+str(respData['nrFailed'])

        self.assertEquals(0, respData['nrFailed'])



class TestCommands(testLib.RestTestCase):
    """Test adding users, logins, etc."""

    def assertResponse(self, respData, errCode = 1, name = None , url = None):
        """
        Check that the response data dictionary matches the expected values
        """
        expected = { 'errCode' : errCode }
        if name is not None:
            expected['name']  = name
        if url is not None:
            expected['url'] = url
        self.assertDictEqual(expected, respData)
    
    def testGifte(self):
        respData = self.makeRequest("/gift/create", method="POST", data = { 'name': 'user1', 'url' : 'hero.com' })
        self.assertResponse(respData, errCode = 1, name = 'user1', url = 'hero.com')

    def testDestroyGift(self):
        self.makeRequest("/gift/destroy", method="POST", data = { 'username' : 'user1', 'password' : 'password'} )
        respData = self.makeRequest("/challenge/create", method="POST", data = { 'username': 'user1' })
        self.assertResponse(respData, errCode = -1)
    






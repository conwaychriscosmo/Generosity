require 'rails_helper'
require 'users'

RSpec.describe Challenge, :type => :model  do
#  pending "add some examples to (or delete) #{__FILE__}"

  describe "challenges" do
    #reset
    before(:each) do
      Gift.delete_all
      Users.delete_all
      Challenge.delete_all
    end

    describe "match" do 

      it "should output a challenge given users" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        output = Challenge.match('george')
        hsh = { errCode: 1, Giver: 'george', Recipient: 'fred' }
        expect(output).to eq hsh
      end


      it "should throw an error given no users" do
        Users.add('greg', 'veryproper')
        output = Challenge.match('greg')
        hsh = {errCode: -1 }
        expect(output).to eq hsh
      end

      it "should match with one of the given users" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Users.add('mike', 'notfromharrypotter')
        output = Challenge.match('george')
        hsh1 = { errCode: 1, Giver: 'george', Recipient: 'fred' }
        hsh2 = { errCode: 1, Giver: 'george', Recipient: 'mike' }
        expect(output).to eq(hsh1).or eq(hsh2)
      end

      it "should have the correct id for making 1 challenge" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        output = Challenge.match('george')
        hsh = Challenge.find_by(id: 1)
        expect(output).to eq hsh
      end

      it "should have the correct id for making 2 challenges" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george')
        output = Challenge.match('fred')
        hsh = Challenge.find_by(id: 2)
        expect(output).to eq hsh
      end

      it "getChallenge" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        output = Challenge.match('george')
        challenge = Challenge.current(1)
        expect(challenge[:Giver]).to eq 'george'
      end
    end


    describe "current" do

      it "should get the current challenge and return the correct json" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        output = Challenge.match('george')
        challenge = Challenge.current('george')
        hsh = { errCode: 1, Giver: 'george', Recipient: 'fred' }
        expect(challenge).to eq hsh
      end

      it "should return the error json because there is no current challenge" do
        Users.add('fred', 'iloveme')
        challenge = Challenge.current('fred')
        hsh = { errCode: -1 }
        expect(challenge).to eq(hsh)
      end

      it "should return the error json because the Recipient is making the request" do
        Users.add('fred', 'iloveme')
        Users.add('joe', 'iloveme')
        Challenge.match('fred')
        challenge = Challenge.current('joe')
        hsh = { errCode: -1 }
        expect(challenge).to eq(hsh)
      end

      it "should return the giver and recipient based on giver username" do
        Users.add('bill', 'hick')
        Users.add('billy', 'mahers')
        Users.add('will', 'free')
        Challenge.match('bill')
        output = Challenge.current('bill')
        giverfromdb = Challenge.find_by(Giver: 'bill')
        outgoal = { errCode: 1, Giver: giverfromdb.Giver, Recipient: giverfromdb.Recipient }
        expect(output).to eq outgoal
      end

    end

    describe "complete" do

      it "should complete the challenge and make a new match" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george') #George -> Fred
        Users.add('michael', 'iloveme')
        output = Challenge.complete('george') 
        challenge = Challenge.current('george')
        expect(challenge[:Giver]).to eq 'george'
        expect(challenge[:Recipient]).to eq('michael').or eq('fred')
      end

      it "should match with the other user if the recipient is deleted" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george') #George -> Fred
        Users.add('michael', 'iloveme')
        Users.destroy_all(:username => 'fred')
        output = Challenge.complete('george') 
        challenge = Challenge.current('george')
        expect(challenge[:Giver]).to eq 'george'
        expect(challenge[:Recipient]).to eq('michael')
      end

      it "should return an errCode of -1 if the giver is deleted" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george') #George -> Fred
        Users.add('michael', 'iloveme')
        Users.destroy_all(:username => 'george')
        output = Challenge.complete('george') 
        hsh = { errCode: -1 }
        expect(output).to eq(hsh)
      end

      it "should update the amount of gifts given for the Giver" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george') #George -> Fred
        Challenge.complete('george') 
        user = Users.find_by(username: 'george')
        giftsGiven = 1
        expect(user.total_gifts_given).to eq(giftsGiven)
      end

      it "should update the amount of gifts received for the Recipient" do
        Users.add('fred', 'iloveme')
        Users.add('george', 'notfromharrypotter')
        Challenge.match('george') #George -> Fred
        output = Challenge.complete('george') 
        user = Users.find_by(username: 'fred')
        giftsReceived = 1
        expect(user.total_gifts_received).to eq(giftsReceived)
      end

    end

  end

end

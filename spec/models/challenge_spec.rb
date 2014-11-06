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

#<<<<<<< HEAD
#<<<<<<< HEAD
#=======
#>>>>>>> testcoverage
    it "getChallenge" do
      Users.add('fred', 'iloveme')
      Users.add('george', 'notfromharrypotter')
      output = Challenge.match('george')
      challenge = Challenge.current(1)
      expect(challenge[:Giver]).to eq 'george'
    end

    it "should complete" do
      Users.add('fred', 'iloveme')
      Users.add('george', 'notfromharrypotter')
      Challenge.match('george')
      Users.add('michael', 'iloveme')
      Users.destroy_all(:username => 'fred')
#<<<<<<< HEAD
      output = Challenge.complete('george')
      hsh = { errCode: 1, Giver: 'george', Recipient: 'michael' }
      challenge = Challenge.current('george')
      expect(challenge[:Giver]).to eq 'george'
    end

      
#>>>>>>> testcoverage
    it "should return the giver and recipient based on giver username" do
      Users.add('bill', 'hick')
      Users.add('billy', 'mahers')
      Users.add('will', 'free')
      Challenge.match('bill')
      output = Challenge.current('bill')
      p "output is "
      p output
      p '*'*15
      giverfromdb = Challenge.find_by(Giver: 'bill')
      outgoal = { errCode: 1, Giver: giverfromdb.Giver, Recipient: giverfromdb.Recipient }
      p outgoal
      expect(output).to eq outgoal
    end
#<<<<<<< HEAD
#>>>>>>> 37bccaf3fcbeb49f39650c3ecfe5c654c4bac062
#=======
#>>>>>>> testcoverage
  end

  


end

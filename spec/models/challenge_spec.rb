require 'rails_helper'
require 'users'

RSpec.describe Challenge, :type => :model  do
#  pending "add some examples to (or delete) #{__FILE__}"

  describe "validations" do
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
      Users.add('greg', 'verykinky')
      output = Challenge.match('greg')
      hsh = {errCode: -1 }
      expect(output).to eq hsh
    end

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
  end

end

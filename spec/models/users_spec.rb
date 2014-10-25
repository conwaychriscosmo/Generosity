
require 'rails_helper'

RSpec.describe Users, :type => :model do
  
	errorCodes = Users.errorCodes()

	describe "validations" do
		it "should not allow username to be too long" do
			user = Users.new(username: 'a'*129, password: 'password')
			user.valid?
			expect(user.errors[:username].size).to eq 1
		end

		it "should not allow identical usernames" do
			Users.create!(username: 'bob', password: 'password')
			user2 = Users.new(username: 'bob', password: 'password')
			user2.valid?
			expect(user2.errors[:username].size).to eq 1
		end

		it "cannot have empty username" do
			user = Users.new(username: '', password: 'password')
			user.valid?
			expect(user.errors[:username].size).to eq 1
		end

		it "should not allow password to be too long" do
			user = Users.new(username: 'alice', password: 'a'*129)
			user.valid?
			expect(user.errors[:password].size).to eq 1
		end
	end

	describe "error codes" do
		it "should have correct error code for empty username" do
		expect(Users.add('', 'a'*6)).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long username" do
	    	expect(Users.add('a'*129, 'a'*6)).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long password" do
	    	expect(Users.add('alice', 'a'*129)).to eq errorCodes[:badPassword]
	    end

	    it "should have correct error code for creating user with same username" do
	    	Users.add('bob', 'a'*6)
	    	expect(Users.add('bob', 'alice')).to eq errorCodes[:userExists]
	    end

	    it "should have correct error code for too short password" do
	    	expect(Users.add('blah', 'abc')).to eq errorCodes[:badPassword]
	    end
	end


end

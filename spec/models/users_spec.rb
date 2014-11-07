
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
		    expect(Users.add({password: 'a'*6})).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long username" do
	    	expect(Users.add({username: 'a'*129, password: 'a'*6})).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long password" do
	    	expect(Users.add({username: 'alice',password: 'a'*129})).to eq errorCodes[:badPassword]
	    end

	    it "should have correct error code for creating user with same username" do
	    	Users.add({username: 'bob', password: 'a'*6})
	    	expect(Users.add({username: 'bob',password: 'b'*6})).to eq errorCodes[:userExists]
	    end

	    it "should have correct error code for too short password" do
	    	expect(Users.add({username: 'blah', password: 'abc'})).to eq errorCodes[:badPassword]
	    end
	end

	describe "Users.add options" do
		it "should allow us to set score" do
			Users.add({username: 'greg', password: 'password', score: 20})
			expect(Users.where(username: 'greg')[0].score).to eq 20
		end

		it "should allow us to set level" do
			Users.add({username: 'greg', password: 'password', level: 100})
			expect(Users.where(username: 'greg')[0].level).to eq 100
		end

		it "should allow us to set current_city" do
			Users.add({username: 'greg', password: 'password', current_city: 'Seattle, WA'})
			expect(Users.where(username: 'greg')[0].current_city).to eq 'Seattle, WA'
		end

		it "should allow us to set available_hours" do
			Users.add({username: 'greg', password: 'password', available_hours: '12am - 6am'})
			expect(Users.where(username: 'greg')[0].available_hours).to eq '12am - 6am'
		end

		it "should allow us to set total_gifts_given" do
			Users.add({username: 'greg', password: 'password', total_gifts_given: 5})
			expect(Users.where(username: 'greg')[0].total_gifts_given).to eq 5
		end

		it "should allow us to set total_gifts_received" do
			Users.add({username: 'greg', password: 'password', total_gifts_received: 6})
			expect(Users.where(username: 'greg')[0].total_gifts_received).to eq 6
		end

		it "should allow us to set profile picture url" do
			Users.add({username: 'greg', password: 'password', profile_url: 'hi.org'})
			expect(Users.where(username: 'greg')[0].profile_url).to eq 'hi.org'
		end
	end


	describe "Users edit options" do
		it "should successfully edit profile_url" do
			Users.add({username: 'greg', password: 'password'})
			Users.editProfileURL('greg', 'hi.edu')
			expect(Users.where(username: 'greg')[0].profile_url).to eq 'hi.org'
		end

		it "should successfully edit current_city"
			Users.add({username: 'greg', password: 'password'})
			Users.editCurrentCity('greg', 'Seattle')
			expect(Users.where(username: 'greg')[0].current_city).to eq 'Seattle'
		end

		it "should successfully edit available_hours" do
			Users.add({username: 'greg', password: 'password'})
			Users.editAvailableHours('greg', '9 to 8')
			expect(Users.where(username: 'greg')[0].available_hours).to eq '9 to 8'
		end

	end



end

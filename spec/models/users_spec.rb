
require 'rails_helper'

RSpec.describe Users, :type => :model do
  
	errorCodes = Users.errorCodes()

	before(:each) do
      Users.delete_all
      Waiting.delete_all
    end

	describe "validations" do
		it "should not allow username to be too long" do
			user = Users.new(username: 'a'*129, password: 'password', real_name: 'bob')
			user.valid?
			expect(user.errors[:username].size).to eq 1
		end

		it "should not allow identical usernames" do
			Users.create!(username: 'bob', password: 'password', real_name: 'bob')
			user2 = Users.new(username: 'bob', password: 'password', real_name: 'rob')
			user2.valid?
			expect(user2.errors[:username].size).to eq 1
		end

		it "cannot have empty username" do
			user = Users.new(username: '', password: 'password', real_name: 'bob')
			user.valid?
			expect(user.errors[:username].size).to eq 1
		end

		it "should not allow password to be too long" do
			user = Users.new(username: 'alice', password: 'a'*129, real_name: 'bob')
			user.valid?
			expect(user.errors[:password].size).to eq 1
		end

		it "should not allow real name to be too long" do
			user = Users.new(username: 'alice', password: 'password', real_name: 'a'*129)
			user.valid?
			expect(user.errors[:real_name].size).to eq 1
		end

		it "should not allow real name to be empty" do
			user = Users.new(username: 'bob', password: 'password')
			user.valid?
			expect(user.errors[:real_name].size).to eq 1
		end
	end

	describe "error codes" do
		it "should have correct error code for empty username" do
		    expect(Users.add({password: 'a'*6, real_name: 'bob'})).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long username" do
	    	expect(Users.add({username: 'a'*129, password: 'a'*6, real_name: 'bob'})).to eq errorCodes[:badUsername]
	    end

	    it "should have correct error code for too long password" do
	    	expect(Users.add({username: 'alice',password: 'a'*129, real_name: 'bob'})).to eq errorCodes[:badPassword]
	    end

	    it "should have correct error code for creating user with same username" do
	    	Users.add({username: 'bob', password: 'a'*6, real_name: 'bob'})
	    	expect(Users.add({username: 'bob',password: 'b'*6})).to eq errorCodes[:userExists]
	    end

	    it "should have correct error code for too short password" do
	    	expect(Users.add({username: 'blah', password: 'abc', real_name: 'bob'})).to eq errorCodes[:badPassword]
	    end

	    it "should have correct error code for bad real name" do
	    	expect(Users.add({username: 'bobby', password: 'password', real_name: ''})).to eq errorCodes[:badRealName]
	    end
	end

	describe "Users.add options" do
		it "should allow us to set score" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', score: 20})
			expect(Users.find_by(username: 'greg').score).to eq 20
		end

		it "should allow us to set level" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', level: 100})
			expect(Users.find_by(username: 'greg').level).to eq 100
		end

		it "should allow us to set current_city" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', current_city: 'Seattle, WA'})
			expect(Users.find_by(username: 'greg').current_city).to eq 'Seattle, WA'
		end

		it "should allow us to set available_hours" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', available_hours: '12am - 6am'})
			expect(Users.find_by(username: 'greg').available_hours).to eq '12am - 6am'
		end

		it "should allow us to set total_gifts_given" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', total_gifts_given: 5})
			expect(Users.find_by(username: 'greg').total_gifts_given).to eq 5
		end

		it "should allow us to set total_gifts_received" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', total_gifts_received: 6})
			expect(Users.find_by(username: 'greg').total_gifts_received).to eq 6
		end

		it "should allow us to set profile picture url" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg', profile_url: 'hi.org'})
			expect(Users.find_by(username: 'greg').profile_url).to eq 'hi.org'
		end
	end


	describe "Users edit options" do
		it "should successfully edit profile_url" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', profile_url: 'hi.edu'})
			expect(user.profile_url).to eq 'hi.edu'
		end

		it "should successfully edit current_city" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', current_city: 'Seattle'})
			expect(user.current_city).to eq 'Seattle'
		end

		it "should successfully edit available_hours" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', available_hours: '9 to 8'})
			expect(user.available_hours).to eq '9 to 8'
		end

		it "should successfully edit level" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', level: 5})
			expect(user.level).to eq 5
		end

		it "should successfully edit total_gifts_received" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', total_gifts_received: 11})
			expect(user.total_gifts_received).to eq 11
		end

		it "should successfully edit total_gifts_given" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', total_gifts_given: 11})
			expect(user.total_gifts_given).to eq 11
		end

		it "should successfully edit score" do
			Users.add({username: 'greg', password: 'password', real_name: 'greg'})
			user = Users.find_by(username: 'greg')
			Users.edit({username: 'greg', score: 500})
			expect(user.score).to eq 500
		end


	end



end

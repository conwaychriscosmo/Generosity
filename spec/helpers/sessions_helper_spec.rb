require 'spec_helper'

# Specs in this file have access to a helper object that includes
# the SessionsHelper. For example:
#
# describe SessionsHelper do
#   describe "string concat" do
#     it "concats two strings with spaces" do
#       expect(helper.concat_strings("this","that")).to eq("this that")
#     end
#   end
# end
describe SessionsHelper do

    before(:each) do
        Users.delete_all 
        #might need to delete all sessions, not sure if Sessions.delete_all is valid though
    end

    describe "login" do
        it "logs the user into the session" do
            helper.login("Joe")
            expect(session[:user_id]).to eq("Joe")
        end

        it "logs a dfferent user into the session" do
            helper.login("Joe")
            helper.login("Bob")
            expect(session[:user_id]).to eq("Bob")
        end
    end

    describe "logout" do
        it "logs the user after logging in" do
            helper.login("Joe")
            helper.logout()
            expect(session[:user_id]).to eq(nil)
        end

        it "logs the user out by making the id = nil" do
            helper.logout()
            expect(session[:user_id]).to eq(nil)
        end

        it "logs the user out after multiple calls" do
            helper.login("Joe")
            helper.logout()
            helper.login("Chris")
            helper.logout()
            expect(session[:user_id]).to eq(nil)
        end
    end

    describe "current user" do
        it "returns the current user" do
            Users.create!(username: 'greg', password: 'password', real_name: 'bob')
            user = Users.find_by(username: 'greg')
            helper.login("greg")
            expect(helper.current_user()).to eq(user)
        end

        it "returns the current user after login and logout" do
            Users.create!(username: 'greg', password: 'password', real_name: 'bob')
            user = Users.find_by(username: 'greg')
            helper.login("greg")
            helper.logout()
            helper.login("greg")
            expect(helper.current_user()).to eq(user)
        end

        it "returns the correct current user w/ logout" do
            Users.create!(username: 'greg', password: 'password', real_name: 'bob')
            Users.create!(username: 'chris', password: 'password', real_name: 'bob')
            user = Users.find_by(username: 'chris')
            helper.login("greg")
            helper.logout()
            helper.login("chris")
            expect(helper.current_user()).to eq(user)
        end

        it "returns the correct current user w/o logout" do
            Users.create!(username: 'greg', password: 'password', real_name: 'bob')
            Users.create!(username: 'chris', password: 'password', real_name: 'bob')
            user = Users.find_by(username: 'chris')
            helper.login("greg")
            helper.login("chris")
            expect(helper.current_user()).to eq(user)
        end

        it "returns false for a logged out current user" do
            helper.login("Joe")
            helper.logout()
            expect(helper.current_user()).to eq(false)
        end
    end

    describe "logged_in?" do
        it "returns true when user is logged in" do
            helper.login("Bob")
            expect(helper.logged_in?).to eq(true)
        end

        it "returns false when nobody is logged in" do
            expect(helper.logged_in?).to eq(false)
        end

        it "returns false after user is logged out" do
            helper.login("Bob")
            helper.logout()
            expect(helper.logged_in?).to eq(false)
        end

        it "returns true when user logs back in" do
            helper.login("Bob")
            helper.logout()
            helper.login("Bob")
            expect(helper.logged_in?).to eq(true)
        end

    end

end

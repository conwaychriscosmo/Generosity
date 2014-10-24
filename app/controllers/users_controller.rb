class UsersController < ApplicationController


    def show()
    	render 'show'
    end

    # Add user USERNAME with password PASSWORD to database. Give them a challenge
	def add()
		username = params[:session][:username]
		password = params[:session][:password]
		code = Users.add(username, password)
		data = {}
		data[:errCode] = code
		if code == 1
			user = Users.find_by(username: username)
			login(user)
			challenge = Challenge.match(username)
			challengeCode = challenge[:errCode]
			data[:challengeCode] = challengeCode
			if challengeCode == 1
			    data[:recipient] = challenge[:Recipient]
			end
		end
		render json: data
	end

	def runUnitTests()
    output = User.runUnitTests()
    last_line = output.lines.last
    last_line_captured = /(?<totalTests>\d+) examples, (?<nrFailed>\d+) failures/.match(last_line)
    totalTests = last_line_captured[:totalTests].to_i
    nrFailed = last_line_captured[:nrFailed].to_i
    render json: {nrFailed: nrFailed, output: output, totalTests: totalTests}
  end
end

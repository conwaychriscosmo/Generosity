class UsersController < ApplicationController


    def show()
    	render 'show'
    end
    #allow user to update current city from profile view
    def editCurrentCity
        username = params[:session][:username]
        newCity = params[:newCity]
        output = Users.editCurrentCity(username, newCity)
	return output
    end

    def editLevel
    
    end

    def editTotalGiftsGiven

    end
    #allow user to update available hours
    def editAvailableHours
        username = params[:session][:username]
        newHours = params[:newHours]
        output = Users.editAvailableHours(username, newHours)
	return output
    end

  
    # Add user USERNAME with password PASSWORD to database. Give them a challenge
	def add()
		username = params[:username]
		password = params[:password]
		code = Users.add(username, password)
		data = {}
		data[:errCode] = code
		if code == 1
			user = Users.find_by(username: username)
			login(user)
			challenge = Challenge.match(username)
			challengeCode = challenge[:errCode]
			data[:challengeCode] = challengeCode
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

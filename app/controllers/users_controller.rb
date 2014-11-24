class UsersController < ApplicationController


    def show()
    	render 'show'
    end

    def edit
        errCode = Users.edit(params)
        render json: {errCode: errCode}
    end

    def setLocation
        errCode = Users.setLocation(params[:user_id], params[:location])
        render json: {errCode: errCode}
    end

    def getLocation
        location = Users.getLocation(params[:user_id])
        render json: {location: location}
    end

  	def add()
		code = Users.add(params)
		data = {}
		data[:errCode] = code
		if code == 1
            username = params[:username]
			user = Users.find_by(username: username)
			login(user)
			# challenge = Challenge.match(username)
			# challengeCode = challenge[:errCode]
			# data[:challengeCode] = challengeCode
		end
		render json: data
	end

    def search()
        userInfo = params[:user]
        sanitizedUserInfo = params.except[:session] 
        # puts params
        # puts userInfo
        # puts sanitizedUserInfo
        users = Users.search(userInfo)
        render json: {users: users}
    end


    def delete()
        if TESTING
            errCode = Users.delete_user(params[:username])
        else
            errCode = Users.errorCodes()[:notTestingMode]
        end
        render json: {errCode: errCode}
    end

    def resetFixture()
        if TESTING
            errCode = Users.resetFixture
        else
            errCode = Users.errorCodes()[:notTestingMode]
        end
        render json: {errCode: errCode}
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

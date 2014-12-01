class UsersController < ApplicationController


    def edit
        errCode = Users.edit(params)
        render json: {errCode: errCode}
    end

    def setLocation
        puts "HAHA"
        puts params
        errCode = Users.setLocation(params[:user_id], params[:location])
        render json: {errCode: errCode}
    end

    def getLocation
        puts "Halleju!"
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
		end
		render json: data
	end

    def search()
        users = Users.search(params[:user])
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

    def purge()
        if Rails.env == "development"
            errCode = Users.all.delete_all
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

    private
      def user_params
        params.permit(:id, :username, :password, :real_name, :level, :current_city, :available_hours, :total_gifts_given, :total_gifts_received, :score, :profile_url, :description)
      end

end

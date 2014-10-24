class SessionsController < ApplicationController
  def new
  end

  def create
    user = Users.find_by(username: params[:session][:username])
    data = {}
    if user && user.authenticate(params[:session][:password])
    	login user
    	data[:errCode] = 1
    	redirect_to '/'
    else
      # Create an error message.
      data[:errCode] = -1
      render json: data
    end
  end

  def destroy
  	logout
    redirect_to root_url
  end
end

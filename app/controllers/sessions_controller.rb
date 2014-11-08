class SessionsController < ApplicationController
  def new
  end

  def create
    user = Users.find_by(username: params[:username])
    data = {}
    if user && user.authenticate(params[:password])
    	login user
    	data[:errCode] = 1
    else
      data[:errCode] = -1
    end
    render json: data
  end

  def destroy
  	logout
    #redirect_to root_url
    render json: {errCode: 1}
  end
end

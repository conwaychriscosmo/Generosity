class SessionsController < ApplicationController
  def new
  end

  def create
    user = Users.find_by(username: params[:session][:username])
    if user && user.authenticate(params[:session][:password])
    	login user
    	redirect_to user
    else
      # Create an error message.
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
  end
end

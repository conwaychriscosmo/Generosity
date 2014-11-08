module SessionsHelper
# Logs in the given user.
  def login(user)
    session[:user_id] = user.id
  end

  def logout()
  	@current_user = session[:user_id] = nil
  end


  # Returns the currently logged-in user (if any).
  def current_user
    @current_user ||= session[:user_id] &&
      User.find_by(id: session[:user_id])
  end

  # Returns true if the user is logged in, false otherwise.
  def logged_in?
    !current_user.nil?
  end
end

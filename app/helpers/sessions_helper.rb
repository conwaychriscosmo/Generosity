module SessionsHelper
# Logs in the given user.
  def login(user)
    session[:user_id] = user.id
end

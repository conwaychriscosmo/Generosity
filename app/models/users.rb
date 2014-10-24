class Users < ActiveRecord::Base

	MIN_PASSWORD_LENGTH = 6
	MAX_PASSWORD_LENGTH = 128
	MAX_USERNAME_LENGTH = 128

	SUCCESS = 1
	ERR_BAD_CREDENTIALS = -1
	ERR_BAD_PASSWORD = -4
	ERR_BAD_USERNAME = -3
	ERR_USER_EXISTS = -2


	validates :username, length: {maximum: MAX_USERNAME_LENGTH}
	validates :password, length: {maximum: MAX_PASSWORD_LENGTH}
	validates :password, length: {minimum: MIN_PASSWORD_LENGTH}
	validates :username, uniqueness: true
	validates :username, presence: true

	has_secure_password

	def self.errorCodes()
		return {success: SUCCESS, badCredentials: ERR_BAD_CREDENTIALS, badPassword: ERR_BAD_PASSWORD,
			badUsername: ERR_BAD_USERNAME, userExists: ERR_USER_EXISTS}
	end

	def self.add(username, password)
		new_user = Users.new(username: username, password: password)
		
		if new_user.valid?
			new_user.save
			return SUCCESS
		else
			case
			when !new_user[:username].present? || new_user[:username].size > MAX_USERNAME_LENGTH
				return ERR_BAD_USERNAME
			when Users.where(username: username).all.size == 1
				return ERR_USER_EXISTS
			when !new_user[:password].present? || new_user[:password].size > MAX_PASSWORD_LENGTH || new_user[:password].size < MIN_PASSWORD_LENGTH
				return ERR_BAD_PASSWORD
			end
		end
	end


	def self.runUnitTests()
		return %x[rspec spec/models/users_spec.rb]
	end

end

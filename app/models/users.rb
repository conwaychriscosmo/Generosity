class Users < ActiveRecord::Base

	MAX_PASSWORD_LENGTH = 128
	MAX_USERNAME_LENGTH = 128

	SUCCESS = 1
	ERR_BAD_CREDENTIALS = -1
	ERR_BAD_PASSWORD = -4
	ERR_BAD_USERNAME = -3
	ERR_USER_EXISTS = -2

	validates :username, length: {maximum: MAX_USERNAME_LENGTH}
	validates :password, length: {maximum: MAX_PASSWORD_LENGTH}
	validates :username, uniqueness: true
	validates :username, presence: true

		def self.add(username, password)
		new_user = User.new(username: username, password: password)
		
		if new_user.valid?
			new_user.save
			return SUCCESS
		else
			case
			when !new_user[:username].present?
				return ERR_BAD_USERNAME
			when new_user[:username].size > MAX_USERNAME_LENGTH
				return ERR_BAD_USERNAME
			when User.where(username: username).all.size == 1
				return ERR_USER_EXISTS
			when new_user[:password].size > MAX_PASSWORD_LENGTH
				return ERR_BAD_PASSWORD
			end
		end
	end

	def self.login(username, password)
		user = User.where(username: username, password: password)
		if user.size == 0
			return ERR_BAD_CREDENTIALS
		else
			return SUCCESS
		end
	end

	def self.runUnitTests()
		return %x[rspec spec/models]
	end
end

class Users < ActiveRecord::Base

	MIN_PASSWORD_LENGTH = 6
	MAX_PASSWORD_LENGTH = 128
	MAX_USERNAME_LENGTH = 128
	MAX_REAL_NAME_LENGTH = 128

	SUCCESS = 1
	ERR_BAD_PASSWORD = -4
	ERR_BAD_USERNAME = -3
	ERR_USER_EXISTS = -2
	ERR_ACTION_NOT_AUTHORIZED = -5
	ERR_REAL_NAME = -6


	validates :username, length: {maximum: MAX_USERNAME_LENGTH}
	validates :username, uniqueness: true
	validates :username, presence: true

	#validates :real_name, presence: true
	validates :real_name, length: {maximum: MAX_REAL_NAME_LENGTH}

	has_secure_password
	validates :password, length: {maximum: MAX_PASSWORD_LENGTH}
	validates :password, length: {minimum: MIN_PASSWORD_LENGTH}



	def self.errorCodes()
		return {success: SUCCESS, badPassword: ERR_BAD_PASSWORD, badUsername: ERR_BAD_USERNAME,
			userExists: ERR_USER_EXISTS, failedEdit: ERR_ACTION_NOT_AUTHORIZED, badRealName: ERR_REAL_NAME}
	end


    def self.edit(user, options)
    	# username = options[:session][:username]
    	# user = Users.find_by(username: username)
    	if user
    		user.profile_url = options[:profile_url] ||= user.profile_url
    		user.current_city = options[:current_city] ||= user.current_city
    		user.available_hours = options[:available_hours] ||= user.available_hours
    		user.level = options[:level] ||= user.level
    		user.total_gifts_given = options[:total_gifts_given] ||= user.total_gifts_given
    		user.total_gifts_received = options[:total_gifts_received] ||= user.total_gifts_received
    		user.score = options[:score] ||= user.score
    		#Need to save/update user
    		user.save(:validate => false)
    		return SUCCESS
    	else
    		return ERR_ACTION_NOT_AUTHORIZED
    	end
    end

	
	def self.add(options)

        username = options[:username]
        password = options[:password]
        real_name = options[:real_name]

		new_user = Users.new(username: username, password: password, real_name: real_name)
		if new_user.valid?
			new_user.available_hours = options[:available_hours] ||= "9am - 6pm"
		    new_user.current_city = options[:current_city] ||= "Berkeley, CA"
			new_user.total_gifts_given = options[:total_gifts_given] ||= 0
			new_user.total_gifts_received = options[:total_gifts_received] ||= 0
			new_user.level = options[:level] ||= 1
			new_user.score = options[:score] ||= 0
			new_user.profile_url = options[:profile_url] ||= 'http://cdn02.animenewsnetwork.com/thumbnails/max500x600/encyc/A15757-989316051.1386311773.jpg'
			new_user.save
			return SUCCESS
		else
			case
			when !new_user[:username].present? || new_user[:username].size > MAX_USERNAME_LENGTH
				return ERR_BAD_USERNAME
			when Users.where(username: username).all.size == 1
				return ERR_USER_EXISTS
			when !new_user[:real_name].present? || new_user[:real_name].size > MAX_REAL_NAME_LENGTH
				return ERR_REAL_NAME
			when !new_user[:password].present? || new_user[:password].size > MAX_PASSWORD_LENGTH || new_user[:password].size < MIN_PASSWORD_LENGTH
				return ERR_BAD_PASSWORD
			end
		end
	end

	def self.search(options)
		puts options[:id]
		return Users.where({id: options[:id]})
	end


	def Users.digest(string)
        cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
                                                      BCrypt::Engine.cost
        BCrypt::Password.create(string, cost: cost)
    end


	def self.runUnitTests()
		return %x[rspec spec/models/users_spec.rb]
	end

end

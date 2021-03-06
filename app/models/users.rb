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
	ERR_USER_DOES_NOT_EXIST = -7
	ERR_NOT_TESTING = -8


	validates :username, length: {maximum: MAX_USERNAME_LENGTH}
	validates :username, uniqueness: true
	validates :username, presence: true

	validates :real_name, length: {maximum: MAX_REAL_NAME_LENGTH}

	has_secure_password
	validates :password, length: {maximum: MAX_PASSWORD_LENGTH}
	validates :password, length: {minimum: MIN_PASSWORD_LENGTH}

	def self.errorCodes()
		return {success: SUCCESS, badPassword: ERR_BAD_PASSWORD, badUsername: ERR_BAD_USERNAME,
			userExists: ERR_USER_EXISTS, failedEdit: ERR_ACTION_NOT_AUTHORIZED, badRealName: ERR_REAL_NAME,
			userDoesNotExist: ERR_USER_DOES_NOT_EXIST, notTestingMode: ERR_NOT_TESTING}
	end


    def self.edit(options)
    	user = Users.find_by(username: options[:username])
    	if user
    		user.profile_url = options[:profile_url] ||= user.profile_url
    		user.real_name = options[:real_name] ||= user.real_name
    		user.current_city = options[:current_city] ||= user.current_city
    		user.available_hours = options[:available_hours] ||= user.available_hours
    		user.level = options[:level] ||= user.level
    		user.total_gifts_given = options[:total_gifts_given] ||= user.total_gifts_given
    		user.total_gifts_received = options[:total_gifts_received] ||= user.total_gifts_received
    		user.score = options[:score] ||= user.score
			user.description = options[:description] ||= user.description

    		user.save(:validate => false)
    		return SUCCESS
    	else
    		return ERR_ACTION_NOT_AUTHORIZED
    	end
    end

    def self.setLocation(user_id, location)
    	user = Users.find_by(id: user_id.to_i)
    	if user
    		user.current_location = location
    		user.save(:validate => false)
    		return SUCCESS
    	end
    	return ERR_USER_DOES_NOT_EXIST
    end

    def self.getLocation(user_id)
    	puts "putsing"
    	puts user_id
    	user = Users.find_by(id: user_id.to_i)
    	puts user.inspect
    	puts "helloooo"
    	if user
    		return user.current_location
    	else
    		return ERR_USER_DOES_NOT_EXIST
    	end
    end

	
	def self.add(options)

        username = options[:username]
        password = options[:password]

		new_user = Users.new(username: username, password: password)
		if new_user.valid?
			new_user.real_name = options[:real_name] ||= "Anonymous"
			new_user.available_hours = options[:available_hours] ||= "9am - 6pm"
		    new_user.current_city = options[:current_city] ||= "Berkeley, CA"
			new_user.total_gifts_given = 0
			new_user.total_gifts_received = 0
			new_user.level = options[:level] ||= 1
			new_user.score = options[:score] ||= 0
			new_user.profile_url = options[:profile_url] ||= 'http://images.sodahead.com/polls/002443001/5330646328_2008_06_25_131330_puts_on_sunglasses_answer_4_xlarge.png'
			new_user.description = options[:description]
			new_user.save
      		Waiting.add(username)
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

	def self.search(options)
		if options[:id]
			return Users.where({id: options[:id]})
		elsif options[:username]
			return Users.where({username: options[:username]})
		end
			
	end

	def self.delete_user(username)
		if Users.delete(Users.find_by(username: username)) != 0
			return SUCCESS
		else
			return ERR_USER_DOES_NOT_EXIST
		end
	end

	def self.resetFixture()
		Users.delete_all
		Challenge.delete_all
		Gift.delete_all
		return SUCCESS
	end



end

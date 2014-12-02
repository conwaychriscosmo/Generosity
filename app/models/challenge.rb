class Challenge < ActiveRecord::Base

  SUCCESS = 1
  ERR_CHALLENGE_NOT_VALID = -101
  ERR_GIVER_USERNAME_BLANK = -102
  ERR_CHALLENGE_RECIPIENT_BLANK = -103
  ERR_TOO_MANY_ATTEMPTS = -104
  ERR_RECIPIENT_NOT_FOUND = -105
  ERR_GIVER_NOT_FOUND = -106
  ERR_NOT_SURE_WHAT_ERROR = -107
  ERR_CHALLENGE_NOT_VALID_2 = -108
  ERR_NOT_ENOUGH_USERS_TO_MATCH = -109
  ERR_CHALLENGE_NOT_FOUND_BY_ID = -110
  ERR_CHALLENGE_NOT_FOUND_BY_GIVER = -111
  ERR_CHALLENGE_NOT_FOUND_BY_GIVER_2 = -112
  ERR_NOT_ENOUGH_USERS_TO_MATCH_2 = -113
  ERR_CHALLENGE_NOT_FOUND_BY_GIVER_3 = -114



  #@@id = 1
  def self.match(username)
  #pick a random user from the database to match with username
    @challenge = Challenge.new
    @challenge.Giver = username
    rec = Waiting.getRecipient
    count = Waiting.count
    if rec[:errCode] != SUCCESS
      output = rec
      return output
    end
    @challenge.Recipient = rec[:username]
    #check to see if matched with self
    if @challenge.Recipient == @challenge.Giver
      #if matched with self and more than one user, try again, else error
      if Waiting.count > 0
        Waiting.add(@challenge.Recipient)
        return Challenge.match(username)
      else
        #the giver will have to wait for a new recipient and to recieve a gift
        Waiting.add(@challenge.Recipient)
        output = { errCode: ERR_NOT_ENOUGH_USERS_TO_MATCH }
        return output
      end
    end
    if @challenge.valid?
      #@challenge.id = @@id
      p 'the id is'
      #p @challenge.id
      p '*'*50
      #@@id = @@id + 1
      @challenge.save
      output = { errCode: SUCCESS, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      output = { errCode: ERR_CHALLENGE_NOT_VALID }
    end
    return output
  end

  def delete(challenge_id)
    Challenge.destroy_all(id: challenge_id)
    output = {errCode: SUCCESS}
    return output
  end

  def self.recipient_by_giver_id(userid)
    @giver = Users.find_by(id: userid)
    if @giver.blank?
      return { errCode: ERR_CHALLENGE_NOT_FOUND_BY_ID }
    end
    if @giver.username.blank?
      return { errCode: ERR_GIVER_USERNAME_BLANK }
    end
    @challenge = Challenge.find_by(Giver: @giver.username)
    if @challenge.blank?
      return { errCode: ERR_CHALLENGE_NOT_FOUND_BY_GIVER }
    end
    if @challenge.Recipient.blank?
      return { errCode: ERR_CHALLENGE_RECIPIENT_BLANK }
    end
    @recipient = Users.find_by(username: @challenge.Recipient)
    return @recipient.to_json


  end

  def self.current(giver)
    @challenge = Challenge.find_by(Giver: giver)
    if @challenge.nil?
      p 'challenge is nil'
      # challenge_id
      p '*'*50
      return { errCode: ERR_CHALLENGE_NOT_FOUND_BY_GIVER_2}
    end
    if @challenge
      recipientUser = Users.find_by(username: @challenge.Recipient)
      return { errCode: SUCCESS, Giver: @challenge.Giver, Recipient: @challenge.Recipient, description: recipientUser.description, availableHours: recipientUser.available_hours, currentCity: recipientUser.current_city, currentLocation: recipientUser.current_location, reputation: recipientUser.score, imageUrl: recipientUser.profile_url }
    end
  end

  #returns the current challenge if there is one for this user
  #def getChallenge(username)
  #  return Challenge.find_by(Giver: username)
  #end
  #if a giver deletes their account, the recipient should be given a new giver in challenges, that is what rematch does
  def self.rematch(chall,attempts)
    if attempts > 50
      return {errCode: ERR_TOO_MANY_ATTEMPTS}
    end
    @challenge = Challenge.new
    @challenge.Recipient = chall.Recipient
    offset = rand(Users.count)
    @rand_user = Users.offset(offset).first
    if @rand_user.blank?
      return Challenge.rematch(chall, attempts+1)
    end
    goat = Challenge.find_by(Giver: @rand_user.username)
    if goat.nil?
      @challenge.Giver = @rand_user.username
    else
      return Challenge.rematch(chall, attempts+1)
    end
    #check to see if matched with self
    if @challenge.Recipient == @challenge.Giver
      #if matched with self and more than one user, try again, else error
      if Users.count > 1
        return Challenge.rematch(chall, attempts+1)
      else
        return { errCode: ERR_NOT_ENOUGH_USERS_TO_MATCH_2 }
      end
    end
    if @challenge.valid?
      #@challenge.id = @@id
      #@@id = @@id + 1
      @challenge.save
      chall.destroy
      return { errCode: ERR_NOT_SURE_WHAT_ERROR, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      return { errCode: ERR_CHALLENGE_NOT_VALID_2 }
    end
  end

  def self.complete(username)
    @challenge = Challenge.find_by(Giver: username)
    #updates the user fields
    output = { errCode: SUCCESS }
    if @challenge.blank?
      return {errCode: ERR_CHALLENGE_NOT_FOUND_BY_GIVER_3}
    end
    giverName = @challenge.Giver
    recipientName = @challenge.Recipient
    giver = Users.find_by(username: giverName)
    recipient = Users.find_by(username: recipientName)
    if recipient.nil?
      return {errCode: ERR_RECIPIENT_NOT_FOUND}
    end
    if giver.nil?
      return {errCode: ERR_GIVER_NOT_FOUND}
    end
    q_output = Waiting.add(recipientName)
    given = giver.total_gifts_given
    given = given + 1
    giver.update_columns(total_gifts_given: given)
    received = recipient.total_gifts_received
    received = received + 1
    recipient.update_columns(total_gifts_received: received)
    #delete current challenge
    Challenge.destroy_all(:Giver => giverName)
    output[:errCode] = q_output[:errCode]
    return output
  #close the last challenge and start the next one by calling
  #match with the username of the currently logged in user
  end

  def self.reject
  #cancel the proposed challenge and get a new one
  #I think this is left for future iterations
  end

  def self.accept
  #accept the challenge
  #I think this is left for future iterations
  end
end

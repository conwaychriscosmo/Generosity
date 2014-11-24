class Challenge < ActiveRecord::Base
  #@@id = 1
  def self.match(username)
  #pick a random user from the database to match with username
    @challenge = Challenge.new
    @challenge.Giver = username
    rec = Waiting.getRecipient
    count = Waiting.count
    if rec[:errCode] != 1
      output = rec
      return output
    end
    @challenge.Recipient = rec[:username]
    #check to see if matched with self
    if @challenge.Recipient == @challenge.Giver
      #if matched with self and more than one user, try again, else error
      if Waiting.count > 0
        Waiting.add(@challenge.Recipient)
        output = Challenge.match(username)
        return output
      else
        #the giver will have to wait for a new recipient and to recieve a gift
        Waiting.add(@challenge.Recipient)
        output = { errCode: -1 }
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
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      output = { errCode: -1 }
    end
    return output
  end

  def delete(challenge_id)
    Challenge.destroy_all(id: challenge_id)
    output = {errCode: 1}
    return output
  end
  
  def self.current(giver)
    @challenge = Challenge.find_by(Giver: giver)
    output = { errCode: -1 }
    if @challenge.nil?
      p 'challenge is nil'
      # challenge_id
      p '*'*50
      return output
    end
    if @challenge
      recipientUser = Users.find_by(username: @challenge.Recipient)
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient, description: recipientUser.description, availableHours: recipientUser.available_hours, currentCity: recipientUser.current_city, currentLocation: recipientUser.current_location, reputation: recipientUser.score }
    end
    return output
  end

  #returns the current challenge if there is one for this user
  #def getChallenge(username)
  #  return Challenge.find_by(Giver: username)
  #end
  #if a giver deletes their account, the recipient should be given a new giver in challenges, that is what rematch does
  def self.rematch(chall,attempts)
    if attempts > 50
      output = {errCode: -2}
      return output
    end
    @challenge = Challenge.new
    @challenge.Recipient = chall.Recipient
    offset = rand(Users.count)
    @rand_user = Users.offset(offset).first
    if @rand_user.blank?
      output = Challenge.rematch(chall, attempts+1)
      return output
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
        output = Challenge.rematch(chall, attempts+1)
        return output
      else
        output = { errCode: -2 }
        return output
      end
    end
    if @challenge.valid?
      #@challenge.id = @@id
      #@@id = @@id + 1
      @challenge.save
      chall.destroy
      output = { errCode: -1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      output = { errCode: -2 }
    end
    return output
  end

  def self.complete(username)
    @challenge = Challenge.find_by(Giver: username)
    #updates the user fields
    output = { errCode: 1 }
    if @challenge.blank?
      output = {errCode: -1}
      return output
    end
    giverName = @challenge.Giver
    recipientName = @challenge.Recipient
    giver = Users.find_by(username: giverName)
    recipient = Users.find_by(username: recipientName)
    if recipient.nil?
      output = {errCode: -2}
      return output
    end
    if giver.nil?
      output = {errCode: -3}
      return output
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

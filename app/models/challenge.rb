class Challenge < ActiveRecord::Base
  @@id = 1
  def self.match(username)
  #pick a random user from the database to match with username
    @challenge = Challenge.new
    @challenge.Giver = username
    offset = rand(Users.count)
    @rand_user = Users.offset(offset).first
    if @rand_user.blank?
      output = Challenge.match(username)
      return output
    end
    #@recip_user = Users.first(:order => "RANDOM()")
    @challenge.Recipient = @rand_user.username
    #check to see if matched with self
    if @challenge.Recipient == @challenge.Giver
      #if matched with self and more than one user, try again, else error
      if Users.count > 1
        output = Challenge.match(username)
        return output
      else
        output = { errCode: -1 }
        return output
      end
    end
    if @challenge.valid?
      @challenge.id = @@id
      @@id = @@id + 1
      @challenge.save
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      output = { errCode: -1 }
    end
    return output
  end
  
  def self.current(challenge_id)
    @challenge = Challenge.find_by(id: challenge_id)
    output = { errCode: -1 }
    if @challenge.nil?
      p 'challenge is nil'
      p challenge_id
      p '*'*50
      return output
    end
    if @challenge
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    end
    return output
  end

  #returns the current challenge if there is one for this user
  #def getChallenge(username)
  #  return Challenge.find_by(Giver: username)
  #end
 
  def self.complete(username)
    @challenge = Challenge.find_by(Giver: username)
    #updates the user fields
    giverName = @challenge.Giver
    recipientName = @challenge.Recipient
    giver = Users.find_by(username: giverName)
    recipient = Users.find_by(username: recipientName)
    if recipient.nil?
      output = Challenge.match(username)
      return output
    end
    giver.total_gifts_given = giver.total_gifts_given + 1
    recipient.total_gifts_received = recipient.total_gifts_received + 1
    giver.save
    recipient.save
    #delete current challenge and set up a new one
    @challenge.destroy
    output = Challenge.match(giverName)
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

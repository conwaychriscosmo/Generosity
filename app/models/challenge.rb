class Challenge < ActiveRecord::Base

  def self.match(username)
  #pick a random user from the database to match with username
    @challenge = Challenge.new
    @challenge.Giver = username
    offset = rand(Users.count)
    @rand_user = Users.offset(offset).first
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
      @challenge.save
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    else
      output = { errCode: -1 }
    end
    return output
  end
  
  def self.current(username)
    @challenge = Challenge.find_by(Giver: username)
    output = { errCode: -1 }
    if @challenge
      output = { errCode: 1, Giver: @challenge.Giver, Recipient: @challenge.Recipient }
    end
    return output
  end

  #returns the current challenge if there is one for this user
  def getChallenge(username)
    return Challenge.where(Giver: username)
  end
 
  def self.complete()

    #updates the user fields
    giverName = self.Giver
    recipientName = self.Recipient
    giver = Users.where(username: giverName)
    recipient = Users.where(username: recipientName)
    giver.total_gifts_given += 1
    recipient.total_gifts_received += 1

    #delete current challenge and set up a new one
    self.destroy
    output = self.match(giverName)
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

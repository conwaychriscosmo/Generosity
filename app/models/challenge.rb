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
        Challenge.match(username)
        return
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

  def self.complete()
    @challenge.delete
    output = self.match(username)
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

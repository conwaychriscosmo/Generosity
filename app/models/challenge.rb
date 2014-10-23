class Challenge < ActiveRecord::Base

  def self.match(username)
  #pick a random user from the database to match with username
    @challenge = Challenge.new
    @challenge.Giver = username
    @recip_user = User.first(:order => "RANDOM()")
    #should make sure it is not the user matched up with himself
    @challenge.Recipient = @recip_user.username
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

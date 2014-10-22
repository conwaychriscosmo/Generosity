class Challenge < ActiveRecord::Base
  def self.match
  #pick a random user from the database
  end

  def self.complete
  #close the last challenge and start the next one
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

class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true
  validates :url, presence: true 

  def resetFixture
    Users.delete_all
    Challenge.delete_all
    Gift.delete_all
    output =  { errCode: 1 }
    return output
  end

  def self.rate(rating, gift_id, username)
    @gift = Gift.find_by(id: gift_id)
    if @gift.recipient == username
      @gift.rating = rating
      if @gift.save
        output = {errCode: 1}
        return output
      else
        output = { errCode: -1 }
      end
    else
      @gift.rating = -1.1
      @gift.save
      output = { errCode: -1 }
    end
    return output
  end

  def self.deliver(gift_id)
    @gift = Gift.find_by(id: gift_id)
    @gift.delivered = true
    if @gift.save
      output = { errCode: 1 }
    else
      output = { errCode: -1 }
    end
    return output
  end


  def self.runUnitTests()
    return %x[rspec spec/models/users_spec.rb]
  end
  def self.create(name, url, username)
    @gift = Gift.new
    @gift.name = name
    @gift.url = url
    @gift.giver = username
    @gift.delivered = false
    @challenge = Challenge.find_by(giver: username)
    rec = @challenge.recipient
    @gift.recipient = rec    
    if @gift.name.nil?
      output = { errCode: -1 }
    end
    if @gift.valid?
      @gift.save
      output = { errCode: 1, name: name, url: url }
    else
      output = { errCode: -1 }
    end
    return output
  end

  #Destroys the gift from the database
  def self.destroy()
    if self.valid?
      self.destroy
      output = {errCode: 1}
    else
      output = {errCode: -1}
    end
    return output
  end
  
end

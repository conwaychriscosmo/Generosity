class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true
  validates :url, presence: true 
  @@id = 1
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
    output = { errCode: -1 }
    if @gift.save
      comp = Challenge.complete(@gift.giver)
      if comp[:errCode] == 1
        output = { errCode: 1 }
      end
    end
    return output
  end

  def delete(gift_id)
    Gift.destroy_all(id: gift_id)
    output = {errCode: 1}
    return output
  end
  def self.review(review, gift_id, username)
    @gift = Gift.find_by(id: gift_id)
    output = { errCode: -1 }
    if @gift.nil?
      return output
    end
    if @gift.recipient == username
      @gift.review = review
      if @gift.save
        output = { errCode: 1 }
      end
    else
      review = "something is seriously wrong"
      @gift.review = review
    end
    return output
  end

  def self.runUnitTests()
    return %x[rspec spec/models/users_spec.rb]
  end
  def self.create(name, url, username)
    @gift = Gift.new
    @gift.name = name
    @gift.id = @@id
    @gift.url = url
    @gift.giver = username
    @gift.delivered = false
    @challenge = Challenge.find_by(giver: username)
    if @challenge.nil?
      p 'challenge is nil :('
      p'*'*50
      output ={errCode: -1}
      return output
    end
    if @challenge.Recipient.nil?
      p @challenge
      p 'challenge has no recipient'
      p '*' *50
      output = {errCode: -1}
      return output
    end
    rec = @challenge.Recipient
    @gift.recipient = rec    
    if @gift.name.nil?
      output = { errCode: -1 }
    end
    if @gift.valid?
      if @gift.save
        @@id = @@id + 1
        output = { errCode: 1, name: name, url: url }
      end
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

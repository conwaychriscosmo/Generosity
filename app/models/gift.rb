require 'json'
class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true
  #validates :url, presence: true
  #@@id = 1
  def self.resetFixture
    Users.delete_all
    Challenge.delete_all
    Gift.delete_all
    Waiting.delete_all
    output =  { errCode: 1 }
    return output
  end


  def self.resetGift
    Gift.delete_all
    output = {errCode: 1}
    return output
  end

  def self.resetChallenge
    Challenge.delete_all
    output = { errCode: 1}
    return output
  end

  def self.resetWaiting
    Waiting.delete_all
    output = { errCode: 1}
    return output
  end


  def self.rate(rating, gift_id, username)
    @gift = Gift.find_by(id: gift_id)
    if @gift.recipient == username
      @gift.update_columns(rating: rating)
      @giver = Users.find_by(username: @gift.giver)
      @recipient = Users.find_by(username: @gift.recipient)
      if @recipient.blank?
        output = { errCode: -17 }
        return output
      end

      if @giver.blank?
        output = { errCode: -20 }
        score = @recipient.score
        score = score + 10
        @recipient.update_columns(score: score)
        return output
      end
      curscore = @giver.score
      newscore = curscore + 10*rating
      @giver.update_columns(score: newscore)
      lvl = newscore%100
      @giver.update_columns(level: lvl)
      score = @recipient.score
      score = score + 10
      @recipient.update_columns(score: score)

      output = {errCode: 1}
    else
      @gift.update_columns(rating: -1.1)
      output = { errCode: -1 }
    end
    return output
  end

  def self.deliver(gift_id)
    @gift = Gift.find_by(id: gift_id)
    if @gift.blank?
      output = { errCode: -1 }
      return output
    end
    @gift.update_columns(delivered: true)
    output = { errCode: -1 }
    comp = Challenge.complete(@gift.giver)
    if comp[:errCode] == 1
      output = { errCode: 1 }
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
      @gift.update_columns(review: review)
      @gift.save
      output = { errCode: 1 }
    else
      review = "something is seriously wrong"
      @gift.update_columns(review: review)
      output = { errCode: -7 }
    end
    return output
  end

  def self.runUnitTests()
    return %x[rspec spec/models/users_spec.rb]
  end

  def self.create(name, url, username, description)
    @gift = Gift.new
    @gift.name = name
    #@gift.id = @@id
    puts "description"
    puts description
    @gift.url = url
    @gift.description = description
    @gift.giver = username
    @gift.delivered = false
    @challenge = Challenge.find_by(Giver: username)
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
      #@gift.id = @@id
      output = {errCode: -7}
      if @gift.save
        #@@id = @@id + 1
        output = { errCode: 1, name: name, url: url }
      end
    else
      output = { errCode: -1 }
    end
    if output[:errCode] != 1
      return output
    else
      reciever = Users.find_by(username: @gift.recipient)
      giver = Users.find_by(username: @gift.giver)
      score = reciever.score
      score = score + 10
      reciever.update_columns(score: score, level: score/100)
      score = giver.score
      score = score + 10
      giver.update_columns(score: score, level: score/100)
      return output

    end
  end

  def self.find_gift(gift_id)
    gift = Gift.find_by_id(gift_id)
    if gift.present?
      return gift.to_json
    else
      return {errCode: -1}
    end
  end

  def self.find_all_gifts_by_giver(giver_username)
    gifts = Gift.where(giver: giver_username)
    if gifts.present?
      return gifts.to_json
    else
      return {errCode: -1}
    end
  end

  def self.find_all_gifts_by_recipient(recipient_username)
    gifts = Gift.where(recipient: recipient_username)
    if gifts.present?
      return gifts.to_json
    else
      return {errCode: -1}
    end
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

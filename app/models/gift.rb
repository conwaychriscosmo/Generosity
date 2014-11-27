require 'json'
class Gift < ActiveRecord::Base

  SUCCESS = 1
  ERR_BLANK_GIVER = -2
  ERR_GIFT_BLANK = -3
  ERR_CHALLENGE_ERROR = -4
  ERR_NIL_GIFT = -5
  ERR_BLANK_RECIPIENT = -6
  ERR_NIL_CHALLENGE = -7
  ERR_NIL_GIFT_NAME = -8
  ERR_GIFT_NOT_SAVED = -9
  ERR_GIFT_NOT_VALID = -10
  ERR_GIFT_NOT_DESTROYED = -11
  ERR_USER_NOT_GIFT_RECIPIENT = -12
  ERR_NO_RECIPIENT_OF_CHALLENGE = -13
  ERR_USER_AND_RECIPIENT_DONT_MATCH = -14
  ERR_GIFT_NOT_FOUND_BY_ID = -15
  ERR_GIFT_NOT_FOUND_BY_GIVER = -16
  ERR_GIFT_NOT_FOUND_BY_RECIPIENT = -17

  validates :name, length: { maximum: 128 }, presence: true
  #validates :url, presence: true
  #@@id = 1
  def self.resetFixture
    Users.delete_all
    Challenge.delete_all
    Gift.delete_all
    Waiting.delete_all
    output =  { errCode: SUCCESS }
    return output
  end


  def self.resetGift
    Gift.delete_all
    output = {errCode: SUCCESS}
    return output
  end

  def self.resetChallenge
    Challenge.delete_all
    output = { errCode: SUCCESS}
    return output
  end

  def self.resetWaiting
    Waiting.delete_all
    output = { errCode: SUCCESS}
    return output
  end


  def self.rate(rating, gift_id, username)
    @gift = Gift.find_by(id: gift_id)
    if @gift.recipient == username
      @gift.update_columns(rating: rating)
      @giver = Users.find_by(username: @gift.giver)
      @recipient = Users.find_by(username: @gift.recipient)
      if @recipient.blank?
        output = { errCode: ERR_BLANK_RECIPIENT }
        return output
      end

      if @giver.blank?
        output = { errCode: ERR_BLANK_GIVER }
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

      output = {errCode: SUCCESS}
    else
      @gift.update_columns(rating: -1.1)
      output = { errCode: ERR_USER_NOT_GIFT_RECIPIENT }
    end
    return output
  end

  def self.deliver(gift_id)
    @gift = Gift.find_by(id: gift_id)
    if @gift.blank?
      output = { errCode: ERR_GIFT_BLANK }
      return output
    end
    @gift.update_columns(delivered: true)
    comp = Challenge.complete(@gift.giver)
    if comp[:errCode] == SUCCESS
      output = { errCode: SUCCESS }
    else
      output = { errCode: ERR_CHALLENGE_ERROR}
    end
    return output
  end

  def delete(gift_id)
    Gift.destroy_all(id: gift_id)
    output = {errCode: SUCCESS}
    return output
  end

  def self.review(review, gift_id, username)
    @gift = Gift.find_by(id: gift_id)
    if @gift.nil?
      return { errCode: ERR_NIL_GIFT}
    end
    if @gift.recipient == username
      @gift.update_columns(review: review)
      @gift.save
      return { errCode: SUCCESS }
    else
      review = "something is seriously wrong"
      @gift.update_columns(review: review)
      return { errCode: ERR_USER_AND_RECIPIENT_DONT_MATCH }
    end
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
      return {errCode: ERR_NIL_CHALLENGE}
    end
    if @challenge.Recipient.nil?
      p @challenge
      p 'challenge has no recipient'
      p '*' *50
      return {errCode: ERR_NO_RECIPIENT_OF_CHALLENGE}
    end
    rec = @challenge.Recipient
    @gift.recipient = rec    
    if @gift.name.nil?
      output = { errCode: ERR_NIL_GIFT_NAME }
    end
    if @gift.valid?
      #@gift.id = @@id
      if @gift.save
        #@@id = @@id + 1
        output = { errCode: SUCCESS, name: name, url: url }
      else
        output = { errCode: ERR_GIFT_NOT_SAVED}
      end
    else
      output = { errCode: ERR_GIFT_NOT_VALID }
    end
    if output[:errCode] != SUCCESS
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
      return {errCode: ERR_GIFT_NOT_FOUND_BY_ID}
    end
  end

  def self.find_all_gifts_by_giver(giver_username)
    gifts = Gift.where(giver: giver_username)
    if gifts.present?
      return gifts.to_json
    else
      return {errCode: ERR_GIFT_NOT_FOUND_BY_GIVER}
    end
  end

  def self.find_all_gifts_by_recipient(recipient_username)
    gifts = Gift.where(recipient: recipient_username)
    if gifts.present?
      return gifts.to_json
    else
      return {errCode: ERR_GIFT_NOT_FOUND_BY_RECIPIENT}
    end
  end

  #Destroys the gift from the database
  def self.destroy()
    if self.valid?
      self.destroy
      output = {errCode: SUCCESS}
    else
      output = {errCode: ERR_GIFT_NOT_DESTROYED}
    end
    return output
  end
  
end

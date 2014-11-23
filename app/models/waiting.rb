class Waiting < ActiveRecord::Base
  OY = -1
  VEY = -2

  def self.add(username)
    output = {errCode: -1}
    waiter = Waiting.new(username: username)
    if waiter.save
      output = { errCode: 1, waiter: waiter}
    end
    return output
  end

  def self.remove(username)
    output = {errCode: -2}
    if Waiting.delete(Waiting.find_by(username: username)) != 0
      output = {errCode: 1}
      return output
    else
      return output
    end
  end

  def self.onQueue(username) #Ensure that someone can only go on the queue once.
    targetUser = Waiting.find_by(username: username)
    puts targetUser
    if targetUser
      output = { errCode: -1 }
      return output
    else
      output = { errCode: 1 }
      return output
    end
  end

  def self.getRecipient
    pros = Waiting.first
    if !pros.present?
      output = {errCode: -3}
    else
      output = {errCode: 1, username: pros.username}
    end
    if output[:errCode] == 1
      temp = Waiting.remove(output[:username])
      output[:errCode] = temp[:errCode]
    end
    return output

  end

end

class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true
  validates :url, presence: true 

  def restFixture
    Users.delete_all
    Challenge.delete_all
    Gift.delete_all
    output =  { errCode: 1 }
    return output
  end

  def self.runUnitTests()
    return %x[rspec spec/models/users_spec.rb]
  end
  def self.create(name, url)
    @gift = Gift.new
    @gift.name = name
    @gift.url = url
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

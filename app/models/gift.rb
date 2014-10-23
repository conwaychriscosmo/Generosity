class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true
  validates :url, presence: true 


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
end

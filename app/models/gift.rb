class Gift < ActiveRecord::Base
  validates :name, length: { maximum: 128 }, presence: true, format: { with: /\A[a-zA-Z]+\z, message: "names must be composed of letters" }
  validates :url, presence: true 


  def self.create(name, url):
    @gift = Gift.new
    @gift.name = name
    @gift.url = url
    if @gift.name.nil?
      output = { errCode: -1 }
    if @gift.valid?
      @gift.save
      output = { errCode: 1, name: name, url: url }
    else
      output = { errcode: -1 }
    end
    return output
  end
end

require 'rails_helper'

RSpec.describe Gift, :type => :model  do
#  pending "add some examples to (or delete) #{__FILE__}"
  
  describe "validations" do
    before(:each) do
      Gift.delete_all
    end

    it "should output the gift name and url" do
      output = Gift.create('cat', 'google.com')
      hsh = { errCode: 1, name: 'cat', url: 'google.com' }
      expect(output).to eq hsh
    end

    it "should enforce short names" do
      longname = 'a'*129
      output = Gift.create(longname, 'a.con')
      hsh = { errCode: -1 }
      expect(output).to eq hsh
    end 
  end    
end

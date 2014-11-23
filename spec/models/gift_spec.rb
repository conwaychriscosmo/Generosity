require 'rails_helper'

RSpec.describe Gift, :type => :model  do
#  pending "add some examples to (or delete) #{__FILE__}"
  
  describe "validations" do
    before(:each) do
      Challenge.delete_all
      Users.delete_all
      Gift.delete_all
      Waiting.delete_all
      us1 = { username: 'george', password: 'PASSWORDZ69'}
      us2 = { username: 'greg', password: 'PASSWORDZ69'}
      Users.add(us1)
      Users.add(us2)
      Challenge.match('greg')
    end

    describe "create" do
      it "should output the gift name and url" do
        output = Gift.create('cat', 'google.com', 'greg')
        hsh = { errCode: 1, name: 'cat', url: 'google.com' }
        expect(output).to eq hsh
      end

      it "should enforce short names" do
        longname = 'a'*129
        output = Gift.create(longname, 'a.con', 'greg')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end
    end

    describe "review" do 
      it "should let recipients review gifts" do
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        review = 'I really loved this gift'
        output = Gift.review(review, @gift.id, 'george')
        hsh = { errCode: 1 }
        expect(output).to eq hsh
      end

      it "should catch the giver making a review" do
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        review = 'I really loved this gift'
        output = Gift.review(review, @gift.id, 'greg')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end

      it "should deal with a bad gift_id" do
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        review = 'I really loved this gift'
        output = Gift.review(review, 0, 'george')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end

      it "should deal with a fake username" do
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        review = 'I really loved this gift'
        output = Gift.review(review, 0, 'georgey')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end
    end

    describe "deliver" do
      it "should should deliver gifts"do
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        output = Gift.deliver(@gift.id)
        hsh = { errCode: 1 }
        expect(output).to eq hsh
      end

      it "should return errCode: -1 with an invalid gift_id" do
        output = Gift.deliver(10)
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end
    end

    describe "rate" do
      it "should return the errCode: 1" do       
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        output = Gift.rate(5, @gift.id, @gift.recipient)
        hsh = { errCode: 1 }
        expect(output).to eq hsh
      end

      it "should have the correct rating" do       
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        Gift.rate(5, @gift.id, 'george')
        rating = 5
        @gift = Gift.find_by(id: @gift.id)
        expect(@gift.rating).to eq rating
      end

      it "should return the errCode: -1" do        
        Gift.create('togeorge', 'google.com', 'greg')
        @gift = Gift.find_by(giver: 'greg')
        output = Gift.rate(5, @gift.id, 'joe')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
      end
    end

  end    
end

require 'rails_helper'

RSpec.describe Waiting, :type => :model do

  before(:each) do
    Waiting.delete_all
  end

  describe "add" do
    it "should add a waiting user" do
        output = Waiting.add('bob')
        hsh = { errCode: 1 }
        expect(output).to eq hsh
    end
  end

  describe "remove" do
    it "should successfully remove a waiting user" do
        Waiting.add('bob')
        output = Waiting.remove('bob')
        hsh = { errCode: 1 }
        expect(output).to eq hsh
    end

    it "should return errCode: -2 when trying to remove a user that doesnt exist" do
        output = Waiting.remove('bob')
        hsh = { errCode: -2 }
        expect(output).to eq hsh
    end
  end

  describe "onQueue" do
    it "should recognize the user is not on the queue" do
        output = Waiting.onQueue('bob')
        hsh = { errCode: 1 }
        expect(output).to eq hsh
    end

    it "should recognize the user is not on the queue" do
        Waiting.add('bob')
        output = Waiting.onQueue('bob')
        hsh = { errCode: -1 }
        expect(output).to eq hsh
    end
  end

  describe "getRecipient" do
    it "should return the first user on the queue with one user" do
        Waiting.add('bob')
        output = Waiting.getRecipient()
        hsh = {errCode: 1, username: 'bob'}
        expect(output).to eq hsh
    end

    it "should return the first user on the queue with two users after removing the first" do
        Waiting.add('bob')
        Waiting.add('tim')
        Waiting.remove('bob')
        output = Waiting.getRecipient()
        hsh = {errCode: 1, username: 'tim'}
        expect(output).to eq hsh
    end

    it "should return the first user on the queue with multiple users" do
        Waiting.add('bob')
        Waiting.add('joe')
        Waiting.add('tim')
        output = Waiting.getRecipient()
        hsh = {errCode: 1, username: 'bob'}
        expect(output).to eq hsh
    end

    it "should return the first user on the queue with multiple users after deleting one" do
        Waiting.add('bob')
        Waiting.add('joe')
        Waiting.add('tim')
        Waiting.remove('bob')
        output = Waiting.getRecipient()
        hsh = {errCode: 1, username: 'joe'}
        expect(output).to eq hsh
    end

    it "should return errCode: -3 b/c there are no users on queue" do
        output = Waiting.getRecipient()
        hsh = {errCode: -3}
        expect(output).to eq hsh
    end
  end
end

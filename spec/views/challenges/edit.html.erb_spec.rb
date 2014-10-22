require 'spec_helper'

describe "challenges/edit" do
  before(:each) do
    @challenge = assign(:challenge, stub_model(Challenge,
      :Giver => "MyString",
      :Recipient => "MyString"
    ))
  end

  it "renders the edit challenge form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", challenge_path(@challenge), "post" do
      assert_select "input#challenge_Giver[name=?]", "challenge[Giver]"
      assert_select "input#challenge_Recipient[name=?]", "challenge[Recipient]"
    end
  end
end

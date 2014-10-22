require 'spec_helper'

describe "challenges/index" do
  before(:each) do
    assign(:challenges, [
      stub_model(Challenge,
        :Giver => "Giver",
        :Recipient => "Recipient"
      ),
      stub_model(Challenge,
        :Giver => "Giver",
        :Recipient => "Recipient"
      )
    ])
  end

  it "renders a list of challenges" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "tr>td", :text => "Giver".to_s, :count => 2
    assert_select "tr>td", :text => "Recipient".to_s, :count => 2
  end
end

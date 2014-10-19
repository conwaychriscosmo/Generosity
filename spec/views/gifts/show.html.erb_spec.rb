require 'spec_helper'

describe "gifts/show" do
  before(:each) do
    @gift = assign(:gift, stub_model(Gift))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end

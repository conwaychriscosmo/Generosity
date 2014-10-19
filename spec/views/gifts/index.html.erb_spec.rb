require 'spec_helper'

describe "gifts/index" do
  before(:each) do
    assign(:gifts, [
      stub_model(Gift),
      stub_model(Gift)
    ])
  end

  it "renders a list of gifts" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end

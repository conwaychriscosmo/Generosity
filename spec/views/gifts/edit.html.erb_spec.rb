require 'spec_helper'

describe "gifts/edit" do
  before(:each) do
    @gift = assign(:gift, stub_model(Gift))
  end

  it "renders the edit gift form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", gift_path(@gift), "post" do
    end
  end
end

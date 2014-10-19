require 'spec_helper'

describe "gifts/new" do
  before(:each) do
    assign(:gift, stub_model(Gift).as_new_record)
  end

  it "renders new gift form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", gifts_path, "post" do
    end
  end
end

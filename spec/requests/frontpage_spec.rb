require 'spec_helper'
describe 'home page' do
	before(:each) do
		visit '/'
	end
  it 'Loads the actual html' do
    page.should have_content('Generosity')
  end

  it 'Correctly loads the navbar.', :js => true do
  	page.should have_content('Generosity Engine')
  end

  it 'loads the js.', :js => true do
  	page.should have_content('Sign up now!')
  end

  it 'validates for empty username.', :js => true do
  	click_link('Sign up now!')
  	click_button('Create Account')
  	puts page.driver.browser.switch_to.alert.text.should eq("Error: The username is empty, too long, or has invalid characters.")
  end

  it 'validates for long username.', :js => true do
  	click_link('Sign up now!')
  	fill_in "Username", with: "a"*101
  	click_button('Create Account')
  	puts page.driver.browser.switch_to.alert.text.should eq("Error: The username is empty, too long, or has invalid characters.")
  end

  it 'validates for no password.', :js => true do
  	click_link('Sign up now!')
  	fill_in "Username", with: "Nucker Dan"
  	click_button('Create Account')
  	puts page.driver.browser.switch_to.alert.text.should eq("Error: The password is empty, too long, or has invalid characters.")
  end

	it 'validates for long password.', :js => true do
  	click_link('Sign up now!')
  	fill_in "Username", with: "Asshole Bob"
  	fill_in "Password", with: "a"*100
  	fill_in "Real Name", with: "OOOH AH"
  	fill_in "6pm-6am", with: "1-9"
  	fill_in "Berkeley, California", with: "Berk"
  	click_button('Create Account')
  	puts page.driver.browser.switch_to.alert.text.should eq("Error: The password is empty, too long, or has invalid characters.")
  end

  it 'creates a user given good input', :js => true do
  	click_link('Sign up now!')
  	fill_in "Username", with: "Asshole Bob"
  	fill_in "Password", with: "haha!fuku"
  	fill_in "Real Name", with: "Hank Hardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	puts page.driver.browser.switch_to.alert.text.should eq("User created.")
  end
end
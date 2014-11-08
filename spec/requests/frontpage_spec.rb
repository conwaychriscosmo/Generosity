require 'spec_helper'
describe 'home page' do
	before (:each) do 
		visit "/"
	end
  it 'Loads the actual html' do
    page.should have_content('Generosity')
  end

  it 'displays shakespeare if challenge is clicked', :js => true do
  	click_link('Challenge')
  	page.should have_content('Midsummer Night')
  end

  it 'redirects to tracker if map is clicked', :js => true do
  	url =URI.parse(current_url)
  	click_link('Map')
  	URI.parse(current_url).should eq(url[0..-3]+"/tracker")
  end

  it 'Correctly loads the navbar.', :js => true do
  	page.should have_content('Generosity Engine')
  end

  it 'loads the js.', :js => true do
  	page.should have_content('Sign up now!')
  end
  it 'creates a user given good input', :js => true do
  	
  	click_link('Sign up now!')
  	value = ""; 8.times{value  << (65 + rand(25)).chr}
  	fill_in "Username", with: value
  	fill_in "Password", with: "haha!fuku"
  	fill_in "Real Name", with: "Hank Hardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	page.driver.browser.switch_to.alert.text.should eq("User created.")
  end

  it 'informs you when empty username is unacceptable', :js => true do
  	click_link('Sign up now!')
  	value = ""; 8.times{value  << (65 + rand(25)).chr}
  	fill_in "Password", with: "haha!fuku"
  	fill_in "Real Name", with: "Hank Hardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	page.driver.browser.switch_to.alert.text.should eq("Error: The username is empty, too long, or has invalid characters.")
  end

  it 'informs you when empty password is unacceptable', :js => true do
  	click_link('Sign up now!')
  	value = ""; 8.times{value  << (65 + rand(25)).chr}
  	fill_in "Username", with: "haha!fuku"
  	fill_in "Real Name", with: "Hank Hardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	page.driver.browser.switch_to.alert.text.should eq("Error: The password is empty, too long, or has invalid characters.")
  end

  it 'informs you when empty real name is unacceptable', :js => true do
  	click_link('Sign up now!')
  	value = ""; 8.times{value  << (65 + rand(25)).chr}
  	fill_in "Username", with: "haha!fuku"
  	fill_in "password", with: "HankHardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	page.driver.browser.switch_to.alert.text.should eq("Error: The real name is empty, too long, or has invalid characters.")
  end

  it 'doesnt log you in with only username', :js => true do
  	click_link("Log in")
  	fill_in "Username", with: "Hahayousuck"
  	page.driver.browser.switch_to.alert.text.should eq("Login failed.")
  end

  it 'doesnt log you in with only username', :js => true do
  	click_link("Log in")
  	fill_in "Username", with: "Hahayousuck"
  	page.driver.browser.switch_to.alert.text.should eq("Login failed.")
  end

  it 'doesnt log you in with no credentials', :js => true do
  	click_link("Log in")
  	page.driver.browser.switch_to.alert.text.should eq("Login failed.")
  end

  it 'logs you in if you exist', :js => true do
  	click_link('Sign up now!')
  	value = ""; 8.times{value  << (65 + rand(25)).chr}
  	fill_in "Username", with: value
  	fill_in "Password", with: "haha!fuku"
  	fill_in "Real Name", with: "Hank Hardon"
  	fill_in "6pm-6am", with: "None"
  	fill_in "Berkeley, California", with: "Hell"
  	click_button('Create Account')
  	click_link("Log in")
  	fill_in "Username", with: value
  	fill_in "Password", with: "haha!fuku"
  	click_button("Log in")
  	page.driver.browser.switch_to.alert.text.should eq("Login succeeded.")
  end

end
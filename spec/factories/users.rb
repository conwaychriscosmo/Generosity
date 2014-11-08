# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :user, :class => 'Users' do
  	username "username"
  	password "password"
  	real_name "real_name"
  end
end

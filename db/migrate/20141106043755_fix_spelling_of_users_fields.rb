class FixSpellingOfUsersFields < ActiveRecord::Migration
  def change
  	  	remove_column :users, :total_gifts_recieved
  	  	add_column :users, :total_gifts_received, :integer

  end
end

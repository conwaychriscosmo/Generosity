class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
    	t.string :username
    	t.string :password
    	t.string :profile_url
    	t.boolean :is_available
    	t.string :current_city
    	t.text :available_hours, array: true, default: []
    	t.integer :level
    	t.integer :total_gifts_given
    	t.integer :total_gifts_recieved
    	t.integer :score 
      t.timestamps
    end
  end
end

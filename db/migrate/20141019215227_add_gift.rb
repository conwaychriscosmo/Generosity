class AddGift < ActiveRecord::Migration
  def change
  	drop_table :gifts
  	create_table :gifts do |t|
  		t.string :name
  		t.string :url
    	t.timestamps
    end
  end
end

class GiftDesc < ActiveRecord::Migration
  def change
  	add_column :gifts, :description, :string
  end
end

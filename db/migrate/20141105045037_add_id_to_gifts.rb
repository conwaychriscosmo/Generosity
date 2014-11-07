class AddIdToGifts < ActiveRecord::Migration
  def change
    add_column :gifts, :id, :integer
  end
end

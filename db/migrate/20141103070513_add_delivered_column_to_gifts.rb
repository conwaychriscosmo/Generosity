class AddDeliveredColumnToGifts < ActiveRecord::Migration
  def change
    add_column :gifts, :delivered, :boolean
  end
end

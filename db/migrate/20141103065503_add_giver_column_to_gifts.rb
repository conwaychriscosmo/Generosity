class AddGiverColumnToGifts < ActiveRecord::Migration
  def change
    add_column :gifts, :giver, :string
  end
end

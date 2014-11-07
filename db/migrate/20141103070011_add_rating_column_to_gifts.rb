class AddRatingColumnToGifts < ActiveRecord::Migration
  def change
    add_column :gifts, :rating, :float
  end
end

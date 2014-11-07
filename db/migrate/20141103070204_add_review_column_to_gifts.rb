class AddReviewColumnToGifts < ActiveRecord::Migration
  def change
    add_column :gifts, :review, :text
  end
end

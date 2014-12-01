class GiftReviewed < ActiveRecord::Migration
  def change
  	add_column :gifts, :reviewed?, :boolean, default: false
  end
end

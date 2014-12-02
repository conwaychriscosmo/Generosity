class ChangeReviewedName < ActiveRecord::Migration
  def change
  	remove_column :gifts, :reviewed?
  	add_column :gifts, :reviewed, :boolean, default: false
  end
end

class AvailHoursToString < ActiveRecord::Migration
  def change
    change_column :users, :available_hours, :string
  end
end

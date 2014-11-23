class CreateWaitings < ActiveRecord::Migration
  def change
    create_table :waitings do |t|
      t.string :username

      t.timestamps
    end
  end
end

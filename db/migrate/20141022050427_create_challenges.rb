class CreateChallenges < ActiveRecord::Migration
  def change
    create_table :challenges do |t|
      t.string :Giver
      t.string :Recipient

      t.timestamps
    end
  end
end

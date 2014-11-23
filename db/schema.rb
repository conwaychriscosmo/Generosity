# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20141123011755) do

  create_table "challenges", force: true do |t|
    t.string   "Giver"
    t.string   "Recipient"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "gifts", force: true do |t|
    t.string   "name"
    t.string   "url"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "giver"
    t.string   "recipient"
    t.float    "rating"
    t.text     "review"
    t.boolean  "delivered"
  end

  create_table "users", force: true do |t|
    t.string   "username"
    t.string   "profile_url"
    t.boolean  "is_available"
    t.string   "current_city"
    t.text     "available_hours",      default: "--- []\n"
    t.integer  "level"
    t.integer  "total_gifts_given"
    t.integer  "score"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "password_digest"
    t.integer  "total_gifts_received"
    t.string   "real_name"
    t.string   "current_location"
    t.string   "description"
  end

end

require "spec_helper"

describe UsersController do
  describe "users routing" do

    it "routes to #welcome" do
      get("/").should route_to("user/#welcome") #note that this is USER not USERS
    end

    it "routes to #new" do
      get("/users/add").should route_to("users#new")
    end

    it "routes to #add" do
      post("/users/add").should route_to("users#add")
    end

    it "routes to #edit" do
      post("/users/edit").should route_to("users#edit")
    end

    it "routes to #runUnitTests" do
      post("TEST/users/unitTests").should route_to("users#runUnitTests")
    end

    it "routes to #resetFixture" do
      post("TEST/resetFixture").should route_to("users#resetFixture")
    end

    it "routes to #search" do
      post("/users/search").should route_to("users#search")
    end

    it "routes to #delete" do
      post("/users/delete").should route_to("users#delete")
    end

  end
end

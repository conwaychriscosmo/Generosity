require "spec_helper"

describe ChallengesController do
  describe "challenge routing" do

    it "routes to #index" do
      get("/challenges").should route_to("challenges#index")
    end

    it "routes to #new" do
      get("/challenges/new").should route_to("challenges#new")
    end

    it "routes to #current" do
      get("/challenges/1/current").should route_to("challenges#getCurrentChallenge", :id => "1")
    end

    it "routes to #complete" do
      post("/challenges/complete").should route_to("challenges#complete")
    end

    it "routes to #joinQueue" do
      post("/challenges/joinQueue").should route_to("challenges#joinQueue")
    end

    it "routes to #onQueue" do
      post("/challenges/onQueue").should route_to("challenges#onQueue")
    end

    it "routes to #show" do
      get("/challenges/1").should route_to("challenges#show", :id => "1")
    end

    it "routes to #edit" do
      get("/challenges/1/edit").should route_to("challenges#edit", :id => "1")
    end

    it "routes to #create" do
      post("/challenges").should route_to("challenges#create")
    end

    it "routes to #resetChallenge" do
      post("/challenges/reset").should route_to("challenges#resetChallenge")
    end

    it "routes to #delete" do
      post("/challenges/1/delete").should route_to("challenges#delete", :id => "1")
    end

    it "routes to #match" do
      post("/challenges/match").should route_to("challenges#match")
    end

    it "routes to #update" do
      put("/challenges/1").should route_to("challenges#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/challenges/1").should route_to("challenges#destroy", :id => "1")
    end

  end
end

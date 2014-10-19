require "spec_helper"

describe GiftsController do
  describe "routing" do

    it "routes to #index" do
      get("/gifts").should route_to("gifts#index")
    end

    it "routes to #new" do
      get("/gifts/new").should route_to("gifts#new")
    end

    it "routes to #show" do
      get("/gifts/1").should route_to("gifts#show", :id => "1")
    end

    it "routes to #edit" do
      get("/gifts/1/edit").should route_to("gifts#edit", :id => "1")
    end

    it "routes to #create" do
      post("/gifts").should route_to("gifts#create")
    end

    it "routes to #update" do
      put("/gifts/1").should route_to("gifts#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/gifts/1").should route_to("gifts#destroy", :id => "1")
    end

  end
end

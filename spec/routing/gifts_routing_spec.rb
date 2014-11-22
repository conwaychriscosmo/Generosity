require "spec_helper"

describe GiftsController do
  describe "routing" do

    post 'gifts/:id/rate', to: 'gifts#rate'
  post 'gifts/:id/review', to: 'gifts#review'
  post 'gifts/:id/deliver', to: 'gifts#deliver'
  post 'gifts/:id/delete', to: 'gifts#delete'
  post 'challenge/:id/delete', to: 'challenges#delete'
  get 'gifts/:id/view', to: 'gifts#view'

    it "routes to #rate" do
      post("/gifts/1/rate").should route_to("gifts#rate", :id => "1")
    end
    it "routes to #review" do
      post("/gifts/1/review").should route_to("gifts#review", :id => "1")
    end
    it "routes to #deliver" do
      post("/gifts/1/deliver").should route_to("gifts#deliver", :id => "1")
    end
    it "routes to #delete" do
      post("/gifts/1/delete").should route_to("gifts#delete", :id => "1")
    end   

    it "routes to #view" do
      post("/gifts/1/view").should route_to("gifts#view", :id => "1")
    end   

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
      post("/gifts").should route_to("gifts#destroy")
    end

    it "routes to #destroy with id" do
      delete("/gifts/1").should route_to("gifts#destroy", :id => "1")
    end

  end
end

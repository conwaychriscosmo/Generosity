require "spec_helper"

describe SessionsController do
  describe "sessions routing" do

    it "routes to #create for login" do
      post("login").should route_to("sessions#create")
    end

    it "routes to #destroy for logout" do
      delete("logout").should route_to("sessions#destroy")
    end

  end
end

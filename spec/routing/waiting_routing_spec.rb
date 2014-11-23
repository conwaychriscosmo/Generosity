require "spec_helper"

describe WaitingController do
  describe "waiting" do
    it "routes to #resetWaiting" do
      post('waiting/reset').should route_to("waiting/resetWaiting")
    end
  end
end
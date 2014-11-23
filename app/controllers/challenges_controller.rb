class ChallengesController < ApplicationController
  before_action :set_challenge, only: [:show, :edit, :update, :destroy]
  
  def joinQueue
    @username = params[:username]
    # @user = Users.find_by(username: @username)
    output = Waiting.add(@username)
    render json: output
  end

  def onQueue
    @username = params[:username]
    output = Waiting.onQueue(@username)
    render json: output
  end
  
  def match
  #built for testing to cause matches
    # @id = session[:user_id]
    puts "swag"
    @id = params[:id]
    @user = Users.find_by(id: @id)
    output = Challenge.match(@user.username)
    render json: output
  end

  def delete
    output = Challenge.delete(params[:id])
    render json: output
  end

  def complete
  #called when a challenge is completed
    @id = session[:user_id]
    @user = Users.find_by(id: @id)
    output = Challenge.complete(@user.username)
    render json: output
  end

  def getCurrentChallenge
    #@username = params[:session][:username]
    @id = params[:id]
    output = Challenge.current(@id)
    render json:  output
  end

  def accept
  #called when a user accepts a challenge
  #i think this is left for a future iteration
  end

  def reject
  #called when a user rejects a challenge
  #I think this is left for a future iteration
  end

  # GET /challenges
  # GET /challenges.json
  def index
    @challenges = Challenge.all
  end

  # GET /challenges/1
  # GET /challenges/1.json
  def show
  end

  # GET /challenges/new
  def new
    @challenge = Challenge.new
  end

  # GET /challenges/1/edit
  def edit
  end

  # POST /challenges
  # POST /challenges.json
  def create
    @challenge = Challenge.new(challenge_params)

    respond_to do |format|
      if @challenge.save
        format.html { redirect_to @challenge, notice: 'Challenge was successfully created.' }
        format.json { render :show, status: :created, location: @challenge }
      else
        format.html { render :new }
        format.json { render json: @challenge.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /challenges/1
  # PATCH/PUT /challenges/1.json
  def update
    respond_to do |format|
      if @challenge.update(challenge_params)
        format.html { redirect_to @challenge, notice: 'Challenge was successfully updated.' }
        format.json { render :show, status: :ok, location: @challenge }
      else
        format.html { render :edit }
        format.json { render json: @challenge.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /challenges/1
  # DELETE /challenges/1.json
  def destroy
    @challenge.destroy
    respond_to do |format|
      format.html { redirect_to challenges_url, notice: 'Challenge was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_challenge
      @challenge = Challenge.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def challenge_params
      params.require(:challenge).permit(:Giver, :Recipient)
    end
end

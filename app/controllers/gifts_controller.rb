class GiftsController < ApplicationController
  before_action :set_gift, only: [:show, :edit, :update, :destroy]

  def resetFixture
    output = Gift.resetFixture
    render json: output
  end

  def runUnitTests
   output = Gift.runUnitTests()
   last_line = output.lines.last
   last_line_captured = /(?<totalTests>\d+) examples, (?<nrFailed>\d+) failures/.match(last_line)
   totalTests = last_line_captured[:totalTests].to_i
   nrFailed = last_line_captured[:nrFailed].to_i
   render json: {nrFailed: nrFailed, output: output, totalTests: totalTests}
  end
  # GET /gifts
  # GET /gifts.json
  def index
    @gifts = Gift.all
  end

  # GET /gifts/1
  # GET /gifts/1.json
  def show
  end

  # GET /gifts/new
  def new
    @gift = Gift.new
  end

  # GET /gifts/1/edit
  def edit
  end

  def delete
    output = Gift.delete(params[:gift][:id])
    render json: output
  end

  def review
    output = Gift.review(params[:gift][:review],params[:gift][:id],params[:session][:username])
    render json: output
  end  
  #the recipient rates the gift
  def rate
    output = Gift.rate(params[:gift][:rating],params[:gift][:id],params[:session][:username])
    render json: output
  end
  
  #the giver delivers the gift
  def deliver
    output = Gift.deliver(params[:gift][:id])
    render json: output
  end
  # POST /gifts
  # POST /gifts.json
  def create
    #@gift = Gift.new(gift_params)
    #create(giftname, gifturl, username)
    output = Gift.create(gift_params[:name], gift_params[:url], params[:session][:username])
    render json: output
 #   respond_to do |format|
  #    if @gift.save
   #     format.html { redirect_to @gift, notice: 'Gift was successfully created.' }
    #    format.json { render :show, status: :created, location: @gift }
     # else
      #  format.html { render :new }
       # format.json { render json: @gift.errors, status: :unprocessable_entity }
    #  end
   # end
  end

  # PATCH/PUT /gifts/1
  # PATCH/PUT /gifts/1.json
  def update
    respond_to do |format|
      if @gift.update(gift_params)
        format.html { redirect_to @gift, notice: 'Gift was successfully updated.' }
        format.json { render :show, status: :ok, location: @gift }
      else
        format.html { render :edit }
        format.json { render json: @gift.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /gifts/1
  # DELETE /gifts/1.json
  def destroy
    @gift.destroy
    respond_to do |format|
      format.html { redirect_to gifts_url, notice: 'Gift was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_gift
      @gift = Gift.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def gift_params
      params[:gift]
    end
end

json.array!(@challenges) do |challenge|
  json.extract! challenge, :id, :Giver, :Recipient
  json.url challenge_url(challenge, format: :json)
end

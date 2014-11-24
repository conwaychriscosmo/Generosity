Rails.application.routes.draw do
  get 'sessions/new'
  resources :challenges

  resources :gifts, :users
  post 'challenges/complete' => 'challenge#complete', as: :complete
  post 'gifts/create' => 'gifts#create'
  post 'gifts/destroy' => 'gifts#destroy'
  post 'gifts/find_gift' => 'gifts#find_gift'
  post 'challenge/complete' => 'challenges#complete'
  post 'challenge/joinQueue' => 'challenges#joinQueue'
  post 'challenge/onQueue' => 'challenges#onQueue'
  post 'challenge/match' => 'challenges#match'
  post 'challenge/getCurrentChallenge' => 'challenges#getCurrentChallenge'
  #get the recipients id based on the giver user id
  post 'challenge/recipient_id' => 'challenges#recipient_id'
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".
  post 'TEST/gifts/unitTests' => 'gifts#runUnitTests'
  #delete all the things
  post 'challenges/reset' => 'gifts#resetChallenge'
  post 'gifts/reset' => 'gifts#resetGift'
  post 'waiting/reset' => 'gifts#resetWaiting'
  # You can have the root of your site routed with "root"
  root :to => 'user#welcome'
  get '/', to: 'user#welcome'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'
  #rate, review, deliver, and view  gifts
  post 'gifts/:id/rate', to: 'gifts#rate'
  post 'gifts/rate', to: 'gifts#rate'
  post 'gifts/:id/review', to: 'gifts#review'
  post 'gifts/review', to: 'gifts#review'
  post 'gifts/:id/deliver', to: 'gifts#deliver'
  post 'gifts/deliver', to: 'gifts#deliver'
  post 'gifts/:id/delete', to: 'gifts#delete'
  post 'challenge/:id/delete', to: 'challenges#delete'
  get 'gifts/:id/view', to: 'gifts#view'

  get 'users/add', to: 'users#new'
  post 'users/add', to: 'users#add'
  post 'users/edit', to: 'users#edit'
  post 'users/search', to: 'users#search'
  post 'users/delete', to: 'users#delete'
  post 'users/setLocation', to: 'users#setLocation'
  post 'users/getLocation', to: 'users#getLocation'

  post 'TEST/resetFixture', to: 'users#resetFixture'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  match '/tracker', to: 'tracker#hunt', via:[:get, :post]

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end

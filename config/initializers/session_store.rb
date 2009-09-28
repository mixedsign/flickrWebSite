# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_flickrWebSite_session',
  :secret      => '5a5fac9a8c380b56fd8386fa88d95cc08219eed27bc594772125660b3f5afd944eb636fe315f2b8bec514d37a7e6d061794e9a21425f3cc04092788f9c14339f'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store

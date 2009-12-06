class PagesController < ApplicationController
  caches_page :homepage
  
  def homepage
  end
  
  def about
  end
end

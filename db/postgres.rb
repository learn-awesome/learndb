require 'pg'
require 'active_record'
require 'json'

# see schema.sql

# To minimize file size, don't export properties with value = null, '', [], false etc. Handle that in code.
# skip hname if it is same as name

module CleanJson
	def as_json(options={})
		super(options).tap do |json|
			json.delete_if{ |k,v| 
				v.blank? || (k == :hname && v == json[:name])
			}.as_json unless options.try(:delete, :null)
		end
	end
end

class ApplicationRecord < ActiveRecord::Base
	include CleanJson
	self.abstract_class = true
end

class Topic < ApplicationRecord; end
class Creator < ApplicationRecord; end
class Item < ApplicationRecord
	def as_json(options={})
		hash = super(options)
		hash["reviews"] = hash["reviews"].map { |r|
			r.delete_if { |k,v| v.blank? }
		} if hash["reviews"]
		hash
	end
end

ActiveRecord::Base.logger = Logger.new(STDERR)

ActiveRecord::Base.establish_connection(
	{ adapter: 'postgresql',
	  database: 'postgres',
	  host: 'localhost',
	  username: 'postgres',
	  password: 'password',
	  port: 5407
	}
)

puts "Postgres: Found #{Topic.count} Topics, #{Creator.count} Creators, #{Item.count} Items"
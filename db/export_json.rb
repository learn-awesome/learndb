require 'pg'
require 'active_record'
require 'json'

class MyDB < ActiveRecord::Base
	self.abstract_class = true
end

class Topic < MyDB; end
class Creator < MyDB; end
class Item < MyDB; end

ActiveRecord::Base.logger = Logger.new(STDERR)

ActiveRecord::Base.establish_connection(
	{ adapter: 'postgresql',
	  database: 'postgres',
	  host: ENV['SUPABASE_HOST'],
	  username: 'postgres',
	  password: ENV['SUPABASE_PASSWORD'],
	  port: 6543
	}
)

File.open("topics.json","w") do |f|
	f.write(JSON.pretty_generate(JSON.parse(Topic.all.to_json)))
end

File.open("creators.json","w") do |f|
	f.write(JSON.pretty_generate(JSON.parse(Creator.all.to_json)))
end

File.open("items.json","w") do |f|
	f.write(JSON.pretty_generate(JSON.parse(Item.all.to_json)))
end

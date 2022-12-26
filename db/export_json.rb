require 'pg'
require 'active_record'
require 'json'

class MyDB < ActiveRecord::Base
	self.abstract_class = true
end

class Topic < MyDB
	def as_json(options = {})
		{
			name: name,
			display_name: hname,
			parent_id: parent_name,
			sort_index: sort_index
		}
	end
end

class Creator < MyDB
end

class Item < MyDB
	def as_json(options = {})
		{
			iid: id, # not a typo
			name: hname,
			description: description,
			image: image_url,
			links: links.join(';'),
			topics: topics.join(';'),
			creators: creators.join(';'),
			year: year,
			difficulty: level,
			cost: cost,
			rating: rating,
			tags: tags.join(';')
		}
	end
end

class Review < MyDB
	def as_json(options = {})
		{
			item_id: item_id,
			by: by_creator,
			rating: rating,
			blurb: blurb,
			url: url
		}
	end
end

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

File.open("reviews.json","w") do |f|
	f.write(JSON.pretty_generate(JSON.parse(Review.all.to_json)))
end
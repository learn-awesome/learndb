require 'pg'
require 'active_record'
require 'json'

class MyDB < ActiveRecord::Base
	self.abstract_class = true
end

class Topic < MyDB; end
class Creator < MyDB; end
class Item < MyDB; end
class Review < MyDB; end

ActiveRecord::Base.logger = Logger.new(STDERR)

ActiveRecord::Base.establish_connection(
	{ adapter: 'postgresql',
	  database: 'postgres',
	  host: ENV['SUPABASE_HOST']
	  username: 'postgres',
	  password: ENV['SUPABASE_PASSWORD'],
	  port: 6543
	}
)

class String
	def slugify
		self.downcase.strip.gsub(' ', '-').gsub(/[^\w-]/,'')
	end
end

topics = File.readlines('topics.js')[1..-2].map{ |l| 
	JSON.parse(l.chomp, symbolize_names: true, object_class: OpenStruct) 
}; 0

items = File.readlines('items.js')[1..-2].map{ |l| 
	JSON.parse(l.chomp.gsub("\\\\","\\"), symbolize_names: true, object_class: OpenStruct) 
}; 0

reviews = File.readlines('reviews.js')[1..-2].map{ |l| 
	JSON.parse(l.chomp.gsub("\\\\","\\"), symbolize_names: true, object_class: OpenStruct) 
}; 0

creators = reviews.map(&:by).uniq; 0


def insert_topic_with_parents(all_topics, topic)
	if topic.parent_id && !Topic.where(name: topic.parent_id).exists?
		# insert parent topic before children to satisfy foreign key constraint
		insert_topic_with_parents(all_topics, all_topics.find {|t| t.name == topic.parent_id})
	end
	
	return if Topic.where(name: topic.name).exists?
	
	Topic.create!(
		name: topic.name,
		hname: topic.display_name,
		parent_name: topic.parent_id,
		sort_index: topic.sort_index
	)
end

MyDB.transaction do
	creators.each do |c|
		Creator.create!(
			name: c.slugify,
			hname: c,
			description: nil,
			image_url: nil,
			tags: [],
			links: []
		)
	end; 0

	topics.each do |t|
		insert_topic_with_parents(topics, t)
	end; 0

	# skip items without links
	items.select { |i| i.links.present? }.each do |i|
		Item.create!(
			id: i.iid,
			hname: i.name,
			description: i.description,
			image_url: i.image,
			tags: i.tags.to_s.split(";"),
			links: i.links.split(";"),
			topics: i.topics.split(";"),
			creators: i.creators.to_s.split(";"),
			year: i.year,
			level: i.level,
			cost: i.cost,
			rating: (i.rating ? (i.rating.to_f * 10).round : nil)
		)
	end; 0

	reviews.each do |r|
		Review.create!(
			item_id: r.item_id,
			by_creator: r.by.slugify,
			rating: (r.rating ? (r.rating.to_f * 10).round : nil),
			blurb: r.blurb,
			url: r.url
		)
	end
end
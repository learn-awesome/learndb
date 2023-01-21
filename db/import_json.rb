# This script imports all data from topics.json, creators.json and items.json into postgres tables

require './postgres.rb'

topics = JSON.parse(File.read('topics.json'))
creators = JSON.parse(File.read('creators.json'))
items = JSON.parse(File.read('items.json'))

puts "import_json: Found #{topics.size} Topics, #{creators.size} Creators, #{items.size} Items in *.json files"

# TODO: Replace create! calls with create_or_update!

# TODO: insertion order of topics is important because of the self-referential foreign key parent_name
topics.each do |t|
	Topic.create!(
		name: t['name'],
		hname: (t['hname'] == t['name'] ? nil : t['hname']),
		description: t['description'],
		image: t['image'],
		tags: t['tags'] || [],

		parent: t['parent'],
		rank: t['rank'],
		roadmap: nil
	)
end

creators.each do |c|
	Creator.create!(
		name: c['name'],
		hname:  (c['hname'] == c['name'] ? nil : c['hname']),
		description: c['description'],
		image: c['image'],
		tags: c['tags'] || [],
		links: c['links'] || [],
	)
end

items.each do |i|
	Item.create!(
		name: i['name'],
		description: i['description'],
		image: i['image'],
		tags: i['tags'] || [],

		links: i['links'] || [],

		prereqs: i['prereqs'] || [],
		topics: i['topics'] || [],
		creators: i['creators'] || [],

		year: i['year'],
		level: i['level'],
		cost: i['cost'],

		rating: i['rating'],
		reviews: i['reviews'] || [],
	)
end

puts "Everything saved in database!"
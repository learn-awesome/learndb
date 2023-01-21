# This script connects to postgres, and exports all data as JSON files that the app expects

require './postgres.rb'
require 'neatjson'

# TODO: print one object on each line
File.open("topics.json","w") do |f|
	f.write(
		JSON.neat_generate(
			JSON.parse(Topic.all.to_json),
			wrap: 120
		)
	)
end

File.open("creators.json","w") do |f|
	f.write(
		JSON.neat_generate(
			JSON.parse(Creator.all.to_json),
			wrap: 80
		)
	)
end

File.open("items.json","w") do |f|
	f.write(
		JSON.neat_generate(
			JSON.parse(Item.all.to_json),
			wrap: 80
		)
	)
end

puts "Everything saved as JSON!"
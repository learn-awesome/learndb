require 'json'
require 'csv'

# Enrich data in items.json by reading data from zlib etc

topics = JSON.parse(File.read('topics.json')); 0
items = JSON.parse(File.read('items.json')); 0
puts "#{items.size} items found"

cols = [:id, :title, :author, :publisher, :extension, :filesize, :language, :year, :pages, :isbn, :ipfs_cid]

zlib = CSV.read('../../zlib-searcher/zlib_index_books.csv'); 0
puts "#{zlib.size} zlib books"

libgen = CSV.read('../../zlib-searcher/libgen_index_books.csv'); 0
puts "#{libgen.size} libgen books"

class String
	def fuzzy_match(str)
		return true if self.downcase == str.downcase
		return false if self.length < 10
		return self.downcase.include?(str.downcase) || str.downcase.include?(self.downcase)
	end
end

my_books = items.select { |i| 
	i["links"].any? {|l| 
		l.split('|').first == 'book' && 
		!l.split('|').last.start_with?('ipfs:') 
	}
}; 0

puts "#{my_books.size} books in items"

matches = JSON.parse(File.read('matches.json'))

my_books[0..10].each do |b|
	next if matches[b['id']]&.size.to_i > 0
	next if b['name'].size < 10

	found = 
		zlib.select { |r| r[1].fuzzy_match(b['name']) } + 
		libgen.select { |r| r[1].fuzzy_match(b['name']) }

	matches[b['id']] = found

end; 0

File.open("matches.json","w") do |f|
	# save results
	f.write(JSON.pretty_generate(matches))
end

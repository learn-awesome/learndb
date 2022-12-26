import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import fs from 'fs';

function copyTopicJSONToPublic(){
	// This is needed for map.html which needs to fetch all topics from server
	console.log("Copying db/topics.json to public/alltopics.json ...");
	fs.copyFileSync("db/topics.json", "public/alltopics.json")
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
	copyTopicJSONToPublic(),
	svelte()
  ],
})
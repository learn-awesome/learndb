import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import { topics } from './db/topics.js'
import fs from 'fs';

function generateTopicJSON(){
	console.log("Generating public/alltopics.json ...")
	const topics_db = topics.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));
	try {
		fs.writeFileSync('public/alltopics.json', JSON.stringify(topics_db));
	} catch (error) {
		console.error(error);
	}

}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [generateTopicJSON(),svelte()],
})
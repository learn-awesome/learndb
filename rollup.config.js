import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import css from 'rollup-plugin-css-only';

import autoPreprocess from 'svelte-preprocess';
import typescript from 'rollup-plugin-typescript2';

import { topics } from './db/topics.js'
import fs from 'fs';

function generateTopicJSON(){
	const topics_db = topics.trimStart().trimEnd().split('\n').map(j => JSON.parse(j));
	try {
		fs.writeFileSync('static/alltopics.json', JSON.stringify(topics_db));
	} catch (error) {
		console.error(error);
	}
	
}

const production = !process.env.ROLLUP_WATCH;

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'static/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: autoPreprocess(),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		typescript({ sourceMap: !production }),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// generate alltopics.json 
		production && generateTopicJSON(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('static'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

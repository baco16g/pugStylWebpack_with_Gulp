import minimist from 'minimist';
import path from 'path';

const envSettings = {
	string: 'env',
	default: {
		env: process.env.NODE_ENV || 'development',
	},
};

const options = minimist(process.argv.slice(2), envSettings);
const production = options.env === 'production';
const destDir = production ? './_release' : './_build';

const config = {
	dirs: {
		src: './_develop',
		dest: destDir,
	},
	bsDirs: {
		src: '/_develop',
		dest: destDir,
	},
	envProduction: production,
};

const tasks = {
	pug: {
		src: [`${config.dirs.src}/pug/!(_)*.pug`, `${config.dirs.src}/pug/pages/**/!(_)*.pug`],
		dest: `${config.dirs.dest}`,
		options: {
			pretty: true,
			basedir: path.join(__dirname, config.dirs.src),
		},
	},
	styl: {
		src: `${config.dirs.src}/styl/!(_)*.styl`,
		dest: `${config.dirs.dest}/assets/css`,
		options: {
			outputStyle: 'expanded',
		},
	},
	babel: {
		src: `${config.dirs.src}/js`,
		dest: `${config.dirs.dest}/assets/js`,
		filename: 'bundle.js',
	},
	images: {
		src: `${config.dirs.src}/images/**/*.{png,jpg,gif,svg,ico}`,
		dest: `${config.dirs.dest}/assets/images`,
	},
	"static": {
		src: `${config.dirs.src}/static/**/*.{css,js,html,png,jpg,gif,svg,ico,eot,svg,ttf,woff,json,mp4}`,
		dest: `${config.dirs.dest}/static`,
	},
	"data": {
		src: `${config.dirs.src}/data/`,
	},
	watch: {
		pug: [`${config.dirs.src}/pug/**/*.pug`, `${config.dirs.src}/data/**/*.json`],
		styl: [`${config.dirs.src}/styl/**/*.styl`, `${config.dirs.src}/data/**/*.json`],
		babel: [`${config.dirs.src}/js/**/*.js`],
		images: [`${config.dirs.src}/images/**/*`],
	},
	clean: [
		config.dirs.dest,
	],
};

config.tasks = tasks;
module.exports = config;

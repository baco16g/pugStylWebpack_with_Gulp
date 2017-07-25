import minimist from 'minimist';

const envSettings = {
	string: 'env',
	default: {
		env: process.env.NODE_ENV || 'development',
	},
};

const options = minimist(process.argv.slice(2), envSettings);
const production = options.env === 'production';

const config = {
	dirs: {
		src: './src',
		dest: './docs',
	},
	absDirs: {
		src: '/src',
		dest: '/docs',
	},
	envProduction: production,
};

const tasks = {
	pug: {
		src: [`${config.dirs.src}/pug/!(_)*.pug`, `${config.dirs.src}/pug/pages/**/!(_)*.pug`],
		dest: `${config.dirs.dest}`,
		options: {
			pretty: true,
			basedir: __dirname + `${config.absDirs.src}`,
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
		src: `${config.dirs.src}/js/app.js`,
		dest: `${config.dirs.dest}/assets/js`,
		filename: 'bundle.js',
	},
	images: {
		src: `${config.dirs.src}/images/**/*.{png,jpg,gif,svg,ico}`,
		dest: `${config.dirs.dest}/assets/images`,
	},
	icon: {
		src: `${config.dirs.src}/icon/**/*.{eot,svg,ttf,woff}`,
		dest: `${config.dirs.dest}/assets/icon`,
	},
	"data": {
		src: `${config.dirs.src}/data/**/*.pdf`,
		dest: `${config.dirs.dest}/assets/data`,
	},
	watch: {
		pug: [`${config.dirs.src}/pug/**/*.pug`],
		styl: [`${config.dirs.src}/styl/**/*.styl`],
		babel: [`${config.dirs.src}/js/**/*.js`],
		images: [`${config.dirs.src}/images/**/*`],
		icon: [`${config.dirs.src}/icon/**/*`],
	},
	clean: [
		config.dirs.dest,
	],
};

config.tasks = tasks;
module.exports = config;

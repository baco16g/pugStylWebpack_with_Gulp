import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import del from 'del';
import fs from 'fs';
import browserSync from 'browser-sync';
import pngquant from 'imagemin-pngquant';
import mergeJson from 'gulp-merge-json';
import webpack from 'webpack';
import webpackConfig from './webpack.config.babel';
import webpackStream from 'webpack-stream';
import config from './config';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// ==========================================================================
// Task function
// ==========================================================================

// Pug compile
function pug() {
	return gulp.src(config.tasks.pug.src)
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.data(function(file){
		let dirname = './data/';
		let files = fs.readdirSync(dirname);
		let json = {};
		files.forEach(function(filename){
			json[filename.replace('.json', '')] = require(dirname + filename);
		});
		return { data: json };
	}))
	.pipe($.pug(config.tasks.pug.options))
	.pipe(gulp.dest(config.tasks.pug.dest))
	.pipe(reload({ stream: true }));
}

// Styl compile
function styl() {
	return gulp.src(config.tasks.styl.src)
	.pipe($.if(!config.envProduction, $.sourcemaps.init()))
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.stylus(config.tasks.styl.options))
	.pipe($.if(!config.envProduction, $.sourcemaps.write()))
	.pipe($.pleeease({
		autoprefixer: ['last 2 versions'],
		minifier: !config.envProduction ? false : true,
		mqpacker: true,
	}))
	.pipe($.size({ title: 'styl' }))
	.pipe($.concat('style.css'))
	.pipe(gulp.dest(config.tasks.styl.dest))
	.pipe(reload({ stream: true }));
}

// ES6 compile
function babel() {
	return gulp.src(config.tasks.babel.src)
		.pipe($.plumber())
		.pipe(webpackStream(webpackConfig, webpack))
		.pipe(gulp.dest(config.tasks.babel.dest));
}

// Image optimize
function images() {
	return gulp.src(config.tasks.images.src, { since: gulp.lastRun(images) })
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.if(!config.envProduction, $.imagemin({
		progressive: true,
		use: [pngquant({ quality: '60-80', speed: 1 })],
	})))
	.pipe(gulp.dest(config.tasks.images.dest))
	.pipe($.size({ title: 'images' }))
	.pipe(reload({ stream: true }));
}

// Icon optimize
function icon() {
	return gulp.src(config.tasks.icon.src, { since: gulp.lastRun(icon) })
	.pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
	.pipe($.if(!config.envProduction, $.imagemin({
		progressive: true,
		use: [pngquant({ quality: '60-80', speed: 1 })],
	})))
	.pipe(gulp.dest(config.tasks.icon.dest))
	.pipe($.size({ title: 'icon' }))
	.pipe(reload({ stream: true }));
}

// Build folder delete
function clean(cb) {
	return del([config.dirs.dest]).then(() => cb());
}

// Local server
function bs(cb) {
	return browserSync.init(null, {
		server: {
			baseDir: config.dirs.dest,
		},
		open: 'external',
		ghostMode: false,
		notify: false,
	}, cb);
}

// ==========================================================================
// Tasks
// ==========================================================================

// Watch
gulp.task('watch', (done) => {
	gulp.watch(config.tasks.watch.pug, gulp.series(pug));
	gulp.watch(config.tasks.watch.styl, gulp.series(styl));
	gulp.watch(config.tasks.watch.babel, gulp.series(babel));
	gulp.watch(config.tasks.watch.images, gulp.series(images));
	gulp.watch(config.tasks.watch.icon, gulp.series(icon));
	done();
});

// Default Build
gulp.task('build', gulp.series(
	clean,
	gulp.parallel(pug, styl, babel, images, icon),
	bs,
));

// Default Build
gulp.task('default', gulp.series('build', 'watch'));

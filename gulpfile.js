var gulp = require('gulp'),
	sass = require('gulp-sass'),
	cleancss = require('gulp-clean-css'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	notify = require('gulp-notify'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	connect = require('gulp-connect');

var pkg = require('./package.json'),
	notes = ['/**',
	  ' * @author <%= pkg.author.name %>',
	  ' * @email <%= pkg.author.email %>',
	  ' * @descrip <%= pkg.description %>',
	  ' * @version v<%= pkg.version %>',
	  ' */',
	  ''].join('\n');

gulp.task('sass', function() {
	return gulp.src('dev/static/style/**/*.scss')
			.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			.pipe(sass())
			.pipe(cleancss())
			.pipe(header(notes, { pkg : pkg } ))
			.pipe(gulp.dest('build/static/style'))
			.pipe(livereload());
});

gulp.task('css', function(){
    return gulp.src('dev/static/**/*.css')
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
            .pipe(cleancss())
            .pipe(gulp.dest('build/static'))
            .pipe(livereload());
});

gulp.task('font', function(){
    return gulp.src('dev/static/style/font/**/*')
            .pipe(gulp.dest('build/static/style/font'))
            .pipe(livereload());
});

gulp.task('uglifyjs', function() {
	return gulp.src(['dev/static/script/**/*.js', '!dev/static/script/**/*.min.js'])
			.pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
			.pipe(uglify({
				mangle: {except: ['require' ,'exports' ,'module' ,'$']}
			}))
			.pipe(header(notes, { pkg : pkg } ))
			.pipe(gulp.dest('build/static/script'))
			.pipe(livereload());
});

gulp.task('js', function(){
	return gulp.src('dev/static/script/**/*.min.js')
			.pipe(gulp.dest('build/static/script'))
			.pipe(livereload());
});

gulp.task('images', function(){
	return gulp.src('dev/static/**/*.{png,jpg,gif,svg,ico}')
			.pipe(gulp.dest('build/static'))
			.pipe(livereload());
});

gulp.task('html', function(){
	return gulp.src('dev/**/*.html')
			.pipe(gulp.dest('build'))
			.pipe(livereload());
});

gulp.task('change', function() {
    gulp.src([
    	'dev/**/*.html',
    	'dev/static/style/**/*.scss',
    	'dev/static/**/*.{png,jpg,gif,svg,ico}',
    	'dev/static/script/**/*.js'
    	])
        .pipe(connect.reload());
});

gulp.task('webserver', function() {
    connect.server({
    	host: '',
    	port: 9999,
    	root: './build/',
    	livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('dev/static/style/**/*.scss', ['sass']);
    gulp.watch('dev/static/**/*.css', ['css']);
    gulp.watch('dev/static/style/font/**/*', ['font']);
    gulp.watch(['dev/static/script/**/*.js', '!dev/static/script/**/*.min.js'], ['uglifyjs']);
    gulp.watch('dev/static/script/**/*.min.js', ['js']);
    gulp.watch('dev/static/**/*.{png,jpg,gif,svg,ico}', ['images']);
    gulp.watch('dev/**/*.html', ['html']);
    gulp.watch([
    	'dev/**/*.html',
    	'dev/static/style/**/*.scss',
    	'dev/static/**/*.{png,jpg,gif,svg,ico}',
    	'dev/static/script/**/*.js'
    	], ['change']);
});

gulp.task('server', ['sass', 'css', 'font', 'uglifyjs', 'js', 'images', 'html', 'webserver', 'watch']);

var gulp = require('gulp'),
    cssimport = require('postcss-import'),
    cssvars = require('postcss-simple-vars'),
    autoprefixer = require('autoprefixer'),
    postcss = require('gulp-postcss'),
    cssnested = require('postcss-nested'),
    mixins = require('postcss-mixins'),
    svgSprite = require('gulp-svg-sprite'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
watch = require('gulp-watch');

gulp.task('styles', function(){
    return gulp.src('./app/assets/css/styles/main.css')
        .pipe(postcss([cssimport,mixins,cssvars,cssnested,autoprefixer()]))
        .on('error', function (errorInfo) {
            console.log(errorInfo.toString());
            this.emit('end');
        })
        .pipe(rename('style.css'))
        .pipe(gulp.dest('./app/assets/css'));
});

var ConfigSVG = {
    mode : {
        css : {
            sprite: 'svg/sprite.svg',
            render : {
                css : {
                    template: './sprite/template.css'
                }
            }
        }
    }
};

gulp.task('svg', function () {
    return gulp.src('./app/assets/images/icons/**/*.svg')
        .pipe(svgSprite(ConfigSVG))
        .pipe(gulp.dest('./sprite/'));
});

gulp.task('copySvg', ['svg'], function () {
    return gulp.src('./sprite/css/svg/**/*.svg')
        .pipe(gulp.dest('./app/assets/images/svg'));
});

gulp.task('copySpriteCSS', ['svg', 'copySvg'], function () {
    return gulp.src('./sprite/css/sprite.css')
        .pipe(rename('_sprite.css'))
        .pipe(gulp.dest('./app/assets/css/styles/partials'));
});

gulp.task('cssInject',['styles'],function(){
    return gulp.src('./app/assets/css/style.css')
        .pipe(browserSync.stream());
});

gulp.task('default', function(){
    browserSync.init({
        server:{
            baseDir : "app"
        }
    });

    watch('./app/index.html', function(){
        browserSync.reload();
    });

    watch('./sprite/template.css', function(){
        gulp.start('copySpriteCSS');
    });

    watch('./app/assets/css/styles/**/*.css', function(){
        gulp.start('cssInject');
    });
});
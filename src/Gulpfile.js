"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    htmlmin = require("gulp-htmlmin"),
    uglify = require("gulp-uglify"),
    rename = require("gulp-rename"),
    merge = require("merge-stream"),
    del = require("del"),
    bundleconfig = require("./bundleconfig.json");

var regex = {
    css: /\.css$/,
    html: /\.(html|htm)$/,
    js: /\.js$/
};

gulp.task('copyfonts', function() {
    gulp.src('./fonts/*.{ttf,woff,eof,svg}')
    .pipe(gulp.dest('./dist/fonts'));
 });

gulp.task("min:js",
    function() {
        let timeStamp = new Date().getTime();
        var tasks = getBundles(regex.js).map(function(bundle) {
            const fileName = gulp.src(bundle.inputFiles, { base: "." })
                .pipe(concat(bundle.outputFileName))
                // .pipe(uglify().on('error', function(e){
                //     console.log(e);
                //  }))
                .pipe(rename({ suffix: '.min' }))
                .pipe(gulp.dest("."));               
            return fileName;
        });
        return merge(tasks);
    });

gulp.task("min:css",
    function() {
        var tasks = getBundles(regex.css).map(function(bundle) {
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(concat(bundle.outputFileName))
                .pipe(cssmin())
                .pipe(rename({ suffix: '.min' })) 
                .pipe(gulp.dest("."));
        });
        return merge(tasks);
    });

gulp.task("min:html",
    function() {
        var tasks = getBundles(regex.html).map(function(bundle) {
            return gulp.src(bundle.inputFiles, { base: "." })
                .pipe(concat(bundle.outputFileName))
                .pipe(htmlmin({ collapseWhitespace: true, minifyCSS: true, minifyJS: true }))
                .pipe(gulp.dest("."));
        });
        return merge(tasks);
    });

gulp.task("clean",
    function() {
        var files = bundleconfig.map(function(bundle) {
            return bundle.outputFileName;
        });

        return del(files);
    });

gulp.task("watch",
    function() {
        getBundles(regex.js).forEach(function(bundle) {
            gulp.watch(bundle.inputFiles, ["min:js"]);
        });

        getBundles(regex.css).forEach(function(bundle) {
            gulp.watch(bundle.inputFiles, ["min:css"]);
        });

        getBundles(regex.html).forEach(function(bundle) {
            gulp.watch(bundle.inputFiles, ["min:html"]);
        });
    });

function getBundles(regexPattern) {
    return bundleconfig.filter(function(bundle) {
        return regexPattern.test(bundle.outputFileName);
    });
}

gulp.task("min", ["min:js", "min:css", "min:html", "copyfonts"]);
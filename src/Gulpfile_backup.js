/*
 * 
 npm install --save gulp gulp-plumber gulp-changed gulp-minify-html gulp-autoprefixer gulp-minify-css gulp-uglify gulp-imagemin gulp-rename gulp-concat gulp-strip-debug gulp-notify gulp-livereload del gulp-inject gulp-jshint@2.x gulp-jshint gulp-replace
 *
 */

/*
 * 
 npm uninstall gulp gulp-plumber gulp-changed gulp-minify-html gulp-autoprefixer gulp-minify-css gulp-uglify gulp-imagemin gulp-rename gulp-concat gulp-strip-debug gulp-notify gulp-livereload del gulp-inject gulp-jshint gulp-replace
 * 
 */

var oldVersionNo = "v1.0.6";
var newVersionNo = "v1.0.0";

var localServerBaseUrl = "http://localhost:61923";
var productionServerBaseUrl = "http://bizbookdemoapi.azurewebsites.net";

var templateUrlDevelopmentDirectory = "partials/";
var templateUrlProductionDirectory = "dist/" + newVersionNo + "/partials/";


var gulp = require("gulp"),
    
    changed = require("gulp-changed"),
    imagemin = require("gulp-imagemin"),
    notify = require("gulp-notify"),

	minifyHTML = require("gulp-minify-html"),

	stripDebug = require("gulp-strip-debug"),
	jshint = require("gulp-jshint"),
    plumber = require("gulp-plumber"),
    concat = require("gulp-concat"),
    uglify = require("gulp-uglify"),
        
    autoprefixer = require("gulp-autoprefixer"),
    minifyCSS = require("gulp-minify-css"),
    
	livereload = require("gulp-livereload"),
    del = require("del"),    
    
    inject = require("gulp-inject");

    replace = require("gulp-replace");





// minify new or changed HTML pages
gulp.task("htmls", function () {
    var htmlSrc = ["./partials/**/*.html"];
    var htmlDist = "./dist/" + newVersionNo + "/partials/";

    gulp.src(htmlSrc)
        .pipe(changed(htmlDist))
        //.pipe(minifyHTML())
        .pipe(gulp.dest(htmlDist))
        //.pipe(notify({ message: 'htmls task complete' }))
    ;

});

//replace tasks
gulp.task("replace-templateurl-config", function() {
    gulp.src(["./dist/" + newVersionNo + "/scripts/config.min.js"])
        .pipe(replace(templateUrlDevelopmentDirectory, templateUrlProductionDirectory))
        .pipe(gulp.dest("./dist/" + newVersionNo + "/scripts/"));
});

gulp.task("replace-templateurl-app", function () {
    gulp.src(["./dist/" + newVersionNo + "/scripts/app.min.js"])
        .pipe(replace(templateUrlDevelopmentDirectory, templateUrlProductionDirectory))
        .pipe(gulp.dest("./dist/" + newVersionNo + "/scripts/"));
});

gulp.task("replace-templateurl-controller", function() {
    gulp.src(["./dist/" + newVersionNo + "/scripts/controller.min.js"])
        .pipe(replace(templateUrlDevelopmentDirectory, templateUrlProductionDirectory))
        .pipe(replace(localServerBaseUrl, productionServerBaseUrl))
        .pipe(gulp.dest("./dist/" + newVersionNo + "/scripts/"));
});

gulp.task("replace-serverurl", function() {
    gulp.src(["./dist/" + newVersionNo + "/scripts/service.min.js"])
        .pipe(replace(localServerBaseUrl, productionServerBaseUrl))
        .pipe(gulp.dest("./dist/" + newVersionNo + "/scripts/"));
});

gulp.task("replace-index", function() {
    gulp.src(["./index.html"])
        .pipe(replace(oldVersionNo, newVersionNo))
        .pipe(replace(localServerBaseUrl, productionServerBaseUrl))
        .pipe(gulp.dest("./"));
});



// Clean
gulp.task("clean", function (cb) {
    del(["dist"], cb);
    console.log("clean task finished");
});

// Default task
gulp.task("html", ["htmls"]);
gulp.task("urlsconfig", ["replace-templateurl-config"]);
gulp.task("urlscontroller", ["replace-templateurl-controller"]);
gulp.task("baseurl", ["replace-serverurl", "replace-templateurl-app"]);
gulp.task("index", ["replace-index"]);

gulp.task("default", ["html","urlsconfig", "urlscontroller", "baseurl", "index"]);





/* eslint-disable */
'use strict';

module.exports = function(gulp, config) {
    const path = require('path');
    const jsonmin = require('gulp-jsonmin');
    const merge = require('merge-stream');
    const OPTIONS = config;

    const jsonMinify = (done) => {
        // Skip JSON minification for now due to stream compatibility issues
        console.log('Skipping JSON minification (compatibility issue with Node.js 22 + Gulp 5)');
        done();
    };

    const copyAirportFiles = (done) => {
        const fs = require('fs');
        const path = require('path');
        
        const sourceDir = path.join(OPTIONS.DIR.BUILD_ASSETS, 'airports');
        const destDir = OPTIONS.DIR.DIST_AIRPORTS;
        
        // Simplified manual copy function
        function copyRecursive(src, dest) {
            try {
                const stats = fs.statSync(src);
                
                if (stats.isDirectory()) {
                    fs.mkdirSync(dest, { recursive: true });
                    const items = fs.readdirSync(src);
                    
                    items.forEach(item => {
                        copyRecursive(path.join(src, item), path.join(dest, item));
                    });
                } else {
                    fs.mkdirSync(path.dirname(dest), { recursive: true });
                    fs.copyFileSync(src, dest);
                }
            } catch (err) {
                console.warn('Copy error:', err.message);
            }
        }
        
        try {
            copyRecursive(sourceDir, destDir);
            done();
        } catch (err) {
            done(err);
        }
    };

    const copyStatic = () => {
        const fonts = gulp.src(OPTIONS.GLOB.FONTS).pipe(gulp.dest(OPTIONS.DIR.DIST_FONT));
        const images = gulp.src(OPTIONS.GLOB.IMAGES).pipe(gulp.dest(OPTIONS.DIR.DIST_IMAGES));
        const tutorial = gulp.src(OPTIONS.GLOB.TUTORIAL).pipe(gulp.dest(OPTIONS.DIR.DIST_TUTORIAL));
        const autocomplete = gulp.src(OPTIONS.GLOB.AUTOCOMPLETE).pipe(gulp.dest(OPTIONS.DIR.DIST_AUTOCOMPLETE));

        return merge(fonts, images, tutorial, autocomplete);
    };

    gulp.task(OPTIONS.TASKS.JSON.MINIFY, gulp.series(jsonMinify));
    gulp.task(OPTIONS.TASKS.COPY.AIRPORTS, gulp.series(copyAirportFiles));
    gulp.task(OPTIONS.TASKS.COPY.STATIC, gulp.series(copyStatic));
    gulp.task(OPTIONS.TASKS.COPY.DIST, gulp.series(
            OPTIONS.TASKS.COPY.STATIC,
            OPTIONS.TASKS.COPY.AIRPORTS,
            OPTIONS.TASKS.JSON.MINIFY
        )
    );
}

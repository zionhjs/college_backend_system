# gulp-requirejs-transformconfig

Gulp plugin for transforming requirejs configs.
 
## Installation

Install package with NPM and add it to your development dependencies:

`npm install gulp-requirejs-transformconfig --save-dev`

## Usage

```js
var requireJsTransformConfig = require('gulp-requirejs-transformconfig');

gulp.task('transform-config', function() {
  return gulp.src('path/to/config.js')
    .pipe(requireJsTransformConfig(function(config) {
        config.map = {
            '*': {
                'foo-module': 'bar-module'
            }
        };
        return config;
    })
    .pipe(gulp.dest('path/to/dist'));
});
```



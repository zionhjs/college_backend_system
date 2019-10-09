var requirejs = require('requirejs/bin/r.js');
var PluginError = require('gulp-util').PluginError;
var through = require('through2');

module.exports = function (transformCb) {
    if (!transformCb) {
        transformCb = function (config) {
            return config;
        };
    }

    function transform(file, encoding, done) {
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
            var error = new PluginError('gulp-requirejs-transformconfig', 'Streams are not supported.');
            return done(error, file);
        }

        var contents = String(file.contents);
        requirejs.tools.useLib(function (rjs) {
            contents = rjs('transform').modifyConfig(contents, transformCb);
            file.contents = new Buffer(contents);
            done(null, file);
        });
    }

    return through.obj(transform);
};

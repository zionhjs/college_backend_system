var transformConfig = require('../index');
var assert = require('stream-assert');
var expect = require('chai').expect;
var sinon = require('sinon');
var gulp = require('gulp');
var path = require('path');
var fs = require('fs');
var File = require('gulp-util').File;

function fixtures(files) {
    return path.join(__dirname, 'fixtures', files);
}

describe('requirejs-transformconfig', function () {

    it('should ignore null files', function (done) {
        var cb = sinon.spy();
        var stream = transformConfig(cb);

        stream
            .pipe(assert.length(1))
            .pipe(assert.end(completed));
        stream.write(new File());
        stream.end();

        function completed() {
            expect(cb.calledOnce).to.eql(false);
            done();
        }
    });

    it('should emit error on streamed file', function (done) {
        gulp.src(fixtures('config.js'), {buffer: false})
            .pipe(transformConfig())
            .on('error', function (err) {
                expect(err.message).to.eql('Streams are not supported.');
                done();
            });
    });

    it('should read require config', function (done) {
        gulp.src(fixtures('config.js'))
            .pipe(transformConfig(function (config) {
                expect(config).to.eql(require('./fixtures/config.expected'));
                return config;
            }))
            .pipe(assert.end(done));
    });

    it('should apply transformation', function (done) {
        gulp.src(fixtures('config.js'))
            .pipe(transformConfig(function (config) {
                config.map = {
                    '*': {'foo-module': 'bar-module'}
                };

                return config;
            }))
            .pipe(assert.length(1))
            .pipe(assert.first(function (file) {
                var expected = fs.readFileSync(fixtures('config.transformed.expected.js'), {encoding: 'utf-8'});
                expect(file.contents.toString()).to.equal(expected)
            }))
            .pipe(assert.end(done));
    });

});

#!/usr/bin/env node
var fs          = require('fs'),
    url         = require('url'),
    http        = require('http'),
    sh          = require('shelljs'),
    yml         = require('js-yaml'),
    color       = require('colors'),
    progress    = require('progress');

// Essential Functions
var download_file_httpget = function(name, file_url, destination) {
    var options = {
        host: url.parse(file_url).host,
        port: url.parse(file_url).port,
        path: url.parse(file_url).pathname
    };

    var file_name;
    if(!destination) {
         file_name = url.parse(file_url).pathname.split('/').pop();
    } else {
        file_name = destination;
    }
    var file = fs.createWriteStream(destination);

    http.get(options, function(response) {
        
        if(response.statusCode === 301 || response.statusCode === 302) {
            download_file_httpget(name, response.headers.location, destination);
        } else {
            var len = parseInt(response.headers['content-length'], 10);
            var bar = new progress('Downloading ' + name + ' [:bar] :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: len
            });

            response.on('data', function(chunk) {
                bar.tick(chunk.length);
                file.write(chunk);
            }).on('end', function() {
                file.end();
                console.log('');
                console.log(('File downloaded to ' + file_name).green);
            });
        }
    });
};

// Noksha Started
var version = '0.0.2';
var config = 'blueprint';
var tmpDir = sh.tempdir() + 'noksha/';

// Requires git
['git'].forEach(function(dep) {
    if(!sh.which(dep)) {
        console.log(('Sorry, this script requires ' + dep).red);
        sh.exit(1);
    }
});

console.log(('noksha v' + version).blue.inverse);

try {
    var deps = require(sh.pwd() + '/' + config + '.yml');
} catch (err) {
    if(err.code === 'MODULE_NOT_FOUND') {
        console.log(('Error - No ' + config + '.yml found on the current directory').red);
    } else {
        console.log(('Check your ' + config + '.yml').red);
    }
    sh.exit(1);
}
for(var name in deps) {
    // console.log(('Processing ' + name).blue);
    var dep = deps[name];
    if(dep) {
        // Prefer using git over web as a source
        if(dep.hasOwnProperty('git')) {
            console.log('Using git repo as source');
            var gitDir = tmpDir + name + '/';
            if(sh.exec('git clone ' + dep.git + ' ' + gitDir).code !== 0) {
              console.log('Error: Git clone failed'.red);
              sh.exit(1);
            }
            console.log('Cloning done');
            sh.cp('-Rf', gitDir + dep.source, sh.pwd() + '/' + dep.target);
            console.log('File(s) sucessfully copies to destination'.green);
            sh.rm('-rf', gitDir);
        }
        // Web
        else if(dep.hasOwnProperty('web')) {
            // console.log('Using web as source');
            if(dep.hasOwnProperty('target')) {
                var path = sh.exec('dirname ' + dep.target, {silent:true}).output.trim();
                if(!sh.test('-d', path)) {
                    // console.log(('Creating directory - ' + path).green);
                    sh.mkdir('-p', path);
                }
            }
            download_file_httpget(name, dep.web, dep.target);
        } else {
            console.log('Invalid rule'.red);
        }
    } else {
        console.log(('Invalid rule for ' + name.inverse).red);
    }
}
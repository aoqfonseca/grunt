/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var spawn = require('child_process').spawn;

// A few internal utilites, exposed.
exports.task = require('../util/task');
exports.namespace = require('../util/namespace');

// A few external utilites, exposed.
exports.hooker = require('hooker');
exports.async = require('async');
exports._ = require('underscore');
exports._.str = require('underscore.string');
exports._.mixin(exports._.str.exports());

// The line feed char for the current system.
exports.linefeed = process.platform === 'win32' ? '\r\n' : '\n';

// Normalize linefeeds in a string.
exports.normalizelf = function(str) {
  return str.replace(/\r\n|\n/g, exports.linefeed);
};

// What "kind" is a value?
// I really need to rework https://github.com/cowboy/javascript-getclass
var kindsOf = {};
'Number String Boolean Function RegExp Array Date Error'.split(' ').forEach(function(k) {
  kindsOf['[object ' + k + ']'] = k.toLowerCase();
});
exports.kindOf = function(value) {
  if (value === null) {
    return 'null';
  } else if (value == null) {
    return 'undefined';
  }
  return kindsOf[kindsOf.toString.call(value)] || 'object';
};

// Coerce something to an Array.
exports.toArray = Function.call.bind(Array.prototype.slice);

// Return the string `str` repeated `n` times.
exports.repeat = function(n, str) {
  return new Array(n + 1).join(str || ' ');
};

// Recurse through objects and arrays, executing fn for each non-object.
exports.recurse = function recurse(value, fn) {
  var obj;
  if (utils.kindOf(value) === 'array') {
    // If value is an array, recurse.
    return value.map(function(value) {
      return recurse(value, fn);
    });
  } else if (utils.kindOf(value) === 'object') {
    // If value is an object, recurse.
    obj = {};
    Object.keys(value).forEach(function(key) {
      obj[key] = recurse(value[key], fn);
    });
    return obj;
  } else {
    // Otherwise pass value into fn and return.
    return fn(value);
  }
};

// Spawn a child process, capturing its stdout and stderr.
exports.spawn = function(opts, done) {
  var child = spawn(opts.cmd, opts.args, opts.opts);
  var stdout = '';
  var stderr = '';
  child.stdout.on('data', function(buf) { stdout += buf; });
  child.stderr.on('data', function(buf) { stderr += buf; });
  child.on('exit', function(code) {
    // Remove trailing whitespace (newline)
    stdout = utils._.rtrim(stdout);
    stderr = utils._.rtrim(stderr);
    // To keep JSHint from complaining about using new String().
    var MyString = String;
    // Create a new string... with properties.
    var result = new MyString(code === 0 ? stdout : 'fallback' in opts ? opts.fallback : stderr);
    result.stdout = stdout;
    result.stderr = stderr;
    result.code = code;
    // On error, pass result object as error object.
    done(code === 0 || 'fallback' in opts ? null: result, result, code);
  });
};

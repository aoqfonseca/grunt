/*global config:true, task:true*/
config.init({
  pkg: '<json:package.json>',
  meta: {
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= template.today("m/d/yyyy") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
      '* Copyright (c) <%= template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
  },
  concat: {
    dist: {
      src: ['<banner>', '<file_strip_banner:lib/<%= pkg.name %>.js>'],
      dest: 'dist/<%= pkg.name %>.js'
    }
  },
  min: {
    dist: {
      src: ['<banner>', '<config:concat.dist.dest>'],
      dest: 'dist/<%= pkg.name %>.min.js'
    }
  },
  test: {
    files: ['test/**/*.js']
  },
  lint: {
    files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'lint test'
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      boss: true,
      eqnull: true
    },
    globals: {
      exports: true,
      module: false
    }
  },
  uglify: {}
});

// Default task.
task.registerTask('default', 'lint test concat min');

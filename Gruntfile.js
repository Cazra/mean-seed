module.exports = function(grunt) {
  var path = require('path');

  var LIB_DIR = 'www/lib/';

  grunt.initConfig({
    clean: ['www'],
    copy: {
      default: {
        files: [
          { // Whole node modules
            cwd: 'node_modules',
            src: [
              '@angular/**',
              'angular2-in-memory-web-api/**',
              'rxjs/**'
            ],
            dest: LIB_DIR,
            expand: true
          },
          { // single-file JS dists from node modules.
            cwd: 'node_modules',
            src: [
              'core-js/client/shim.min.js',
              'reflect-metadata/Reflect.js',
              'systemjs/dist/system.src.js',
              'underscore/underscore-min.js',
              'zone.js/dist/zone.js'
            ],
            dest: LIB_DIR,
            rename: function(dest, src) {
              return dest + path.basename(src);
            },
            expand: true
          },
          { // Other JS files
            cwd: 'src/client',
            src: ['systemjs.config.js'],
            dest: 'www',
            expand: true
          },
          { // Static web files
            cwd: 'static',
            src: '**/*',
            dest: 'www',
            expand: true
          }
        ]
      }
    },
    jshint: {
      options: {
        maxerr: 50,

        // Enforcing
        bitwise: true,
        camelcase: true,
        curly: false,
        eqeqeq: true,
        forin: true,
        freeze: true,
        immed: false,
        indent: 2,
        latedef: 'nofunc',
        maxcomplexity: 20,
        maxdepth: 5,
        maxlen: 80,
        newcap: true,
        noarg: true,
        noempty: true,
        nonbsp: true,
        nonew: false,
        notypeof: false,
        plusplus: false,
        quotmark: false,
        shadow: false,
        strict: true,
        undef: true,
        unused: true,
        varstmt: false,

        // Environments
        browser: false,
        mocha: true,
        node: true,

        // Relaxing
        asi: false,
        boss: false,
        debug: false,
        eqnull: false,
        esversion: 6,
        evil: false,
        expr: false,
        funcscope: false,
        globalstrict: false,
        iterator: false,
        lastsemic: false,
        laxbreak: false,
        laxcomma: false,
        loopfunc: false,
        moz: false,
        multistr: false,
        noyield: false,
        proto: false,
        scripturl: false,
        sub: false,
        supernew: false,
        validthis: false
      },
      files: {
        src: [
          'src/server/**/*.js',
          'test/**/*.js'
        ]
      }
    },
    less: {
      default: {
        files: [
          {
            cwd: 'src/client',
            src: '**/*.less',
            dest: 'www/',
            expand: true,
            rename: function(dest, src) {
              console.log(dest, src);

              return dest + src.replace('.less', '.css');
            }
          }
        ]
      }
    },
    pug: {
      default: {
        files: [
          {
            cwd: 'src/client',
            src: '**/*.pug',
            dest: 'www/',
            expand: true,
            rename: function(dest, src) {
              return dest + src.replace('.pug', '.html');
            }
          }
        ],
        options: {
          doctype: 'html',
          pretty: true
        }
      }
    },
    ts: {
      default: {
        tsconfig: true
      }
    },
    tslint: {
      default: {
        files: {
          src: 'src/**/*.ts'
        },
        options: {
          configuration: {
            // TS-only configs
            'adjacent-overload-signatures': true,
            'no-inferrable-types': true,
            'no-var-requires': true,
            'only-arrow-functions': true,

            // Functionality configs
            'no-conditional-assignment': true,
            'no-duplicate-key': true,
            'no-duplicate-variable': true,
            'no-empty': true,
            'no-eval': true,
            'no-for-in-array': true,
            'no-invalid-this': true,
            'no-shadowed-variable': true,
            'no-unreachable': true,
            'no-unused-expression': true,
            'no-unused-new': true,
            'no-use-before-declare': true,
            'no-var-keyword': true,
            'switch-default': true,
            'triple-equals': true,
            'use-isnan': true,
            'use-strict': true,

            // Maintainability configs
            'eoftline': true,
            'indent': [true, 'spaces'],
            'max-line-length': [true, 80],
            'no-default-export': true,
            'no-require-imports': true,
            'no-trailing-whitespace': true,

            // Style configs
            'class-name': true,
            'new-parens': true,
            'ordered-imports': true,
            'quotemark': [true, 'single'],
            'semicolon': [true, 'always']
          }
        }
      }
    },
    uglify: {
      default: {
        files: {
          'www/app/main.js': ['www/app/main.js']
        },
        options: {
          beautify: false,
          compress: true,
          mangle: { screw_ie8 : true, keep_fnames: true }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.registerTask('cleanup', ['clean']);
  grunt.registerTask('default', ['copy', 'jshint', 'tslint', 'ts',
    'uglify', 'less', 'pug']);
};

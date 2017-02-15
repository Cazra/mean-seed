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
          }
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
        src: ['src/client/app/**/*.ts', 'typings/**/*.d.ts'],
        out: 'www/app/main.js'
        //outDir: 'www/app'
      },
      options: {
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        module: 'system',
        moduleResolution: 'node',
        noImplicitAny: false,
        removeComments: false,
        sourceMap: false,
        target: 'es5'
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
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-pug');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-ts');
  grunt.loadNpmTasks('grunt-tslint');

  grunt.registerTask('cleanup', ['clean']);
  grunt.registerTask('default', ['copy', 'tslint', 'ts',
    'uglify', 'less', 'pug']);
};

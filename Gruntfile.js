module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      files: ['public/js/*', 'public/js/controllers/*'],
      tasks: ['browserify']
    },
    browserify: {
      dist: {
        files: {
          'public/dist/bundle.js': ['public/js/main.js'],
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-browserify');
};

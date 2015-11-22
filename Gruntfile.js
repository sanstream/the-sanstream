module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        sass: {
            dist: {
                files: {
                    'css/the-sanstream.css' : 'sass/the-sanstream.scss'
                }
            }
        },

        concat:{
            dist:{
                src: [
                    'js/*.js'
                ],
                dest:'js/build/production.js'
            }
        },

        watch: {
            css: {
                files: '**/*.scss',
                tasks: ['sass']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default',['watch']);
}

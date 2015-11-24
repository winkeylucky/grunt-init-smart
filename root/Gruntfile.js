/*
 * grunt-init-smart
 * https://github.com/hankewins/grunt-init-smart
 *
 * Copyright (c) 2015 hankewins
 * Licensed under the MIT license.
 */

'use strict';

// assets 静态资源文件目录路径
var staticRootPath = '../../../repos';
var staticResPath  = staticRootPath + '/apps/3g';
var staticSysPath  = staticRootPath + '/repos/sys';

module.exports = function(grunt) {

    // 加载 grunt 任务 
    require('load-grunt-tasks')(grunt, {
        pattern: ['grunt-contrib-*', 'grunt-usemin']
    });

    // 统计 grunt 任务耗时
    require('time-grunt')(grunt);

    grunt.loadNpmTasks('grunt-usemin');

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //清除目录
        clean: {
            all: ['dest/**', 'dest/*.*'],
            img: 'dest/assets/img',
            pic: 'dest/assets/pic',
            css: 'dest/assets/css'
        },

        // 复制
        copy: {
            all: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets',
                    src: ['**/*'],
                    dest: staticResPath + '/' + '<%= pkg.name %>'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: './',
                    src: ['*.html'],
                    dest: 'dest'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets',
                    src: ['css/**/*.min.css'],
                    dest: 'dest/assets/css'
                }]
            },
            img: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets',
                    src: ['img/**/*.{png,jpg,jpeg,gif}'],
                    dest: 'dest/assets/img'
                }]
            },
            pic: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets',
                    src: ['pic/**/*.img.{png,jpg,jpeg,gif}'],
                    dest: 'dest/assets/pic'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'dest/assets',
                    src: ['js'],
                    dest: 'dest/assets/js'
                }]
            }
        },

        //压缩图片
        imagemin: {
            prod: {
                options: {
                    optimizationLevel: 7,
                    pngquant: true
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: ['img/**/*.{png,jpg,jpeg,gif,webp,svg}', 'pic/**/*.xxx.{png,jpg,jpeg,gif,webp,svg}'],
                    dest: 'dest/assets'
                }]
            }
        },

        // 配置compass编译
        compass: {
            build: {
                options: {
                    require: 'lookitui',
                    sassDir: './assets/src',
                    cssDir: './assets/css',
                    imagesDir: './assets/img',
                    javascriptsDir: './assets/js',
                    noLineComments: true
                }
            }
        },

        // 压缩JS
        uglify: {
            prod_zepto: {
                options: {
                    banner: '/*! Zepto 1.1.6 - zepto event data touch ajax - zeptojs.com/license */\n',
                },
                files:{
                    'dest/assets/js/zepto.min.js':['bower_components/zeptojs/src/zepto.js','bower_components/zeptojs/src/event.js','bower_components/zeptojs/src/data.js','bower_components/zeptojs/src/touch.js','bower_components/zeptojs/src/ajax.js']
                }
            },
            prod_dot_source: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: ['js/**/*.source.js', '!js/**/*.min.js'],
                    dest: 'dest/assets',
                    ext: '.min.js'
                }]
            },
            prod: {
                options: {
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: ['js/**/*.js', '!js/**/*.source.js', '!js/**/*.min.js'],
                    dest: 'dest/assets'
                }]
            }
        },

        // 配置cssmin压缩
        cssmin: {
            prod: {
                options: {
                    report: 'gzip'
                },
                files: [{
                    expand: true,
                    cwd: 'assets',
                    src: ['css/**/*.css', '!css/**/*.min.css'],
                    dest: 'dest/assets',
                    ext: '.min.css'
                }]
            }
        },

        // useminPrepare: {
        //     html: ['*.html'],
        //     options: {
        //         dest: './'               
        //     }
        // },

        // 处理html中css、js 引入合并问题
        usemin: {
            html: 'dest/*.html',
        },

        //配置浏览器自动刷新加同步 跟watch共同使用
        browserSync: {
            dev: {
                bsFiles: {
                    src: '**'
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: './'
                    }
                }
            }
        },

        // 配置watch监控
        watch: {
            css: {
                files: ['assets/src/*.scss'],
                tasks: ['compass']
            }
            /*,
                js: {
                    files:['assets/js/!**!/!*.js'],
                    tasks:['uglify']
                }*/
            // ,
            // livereload:{
            //     files:['*.html', 'assets/css/*', 'assets/js/*', 'assets/img/**/*'],
            //     options:{
            //         livereload:true
            //     }
            // }
        }
    });

    grunt.registerTask('useminTask', [
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin'
    ]);

    //默认被执行的任务列表
    grunt.registerTask('default', ['compass', 'watch']);
    
    // 发布到dest目录
    grunt.registerTask('test', [
        'clean:all', 
        'copy:html',
        'uglify',
        'useminTask',
        'cssmin', 
    ]);

    grunt.registerTask('imgmin', ['imagemin']);

    // 发布到assets目录
    grunt.registerTask('publish', [
        'clean:all', 
        'copy:html', 
        'uglify',
        'useminTask',
        'cssmin', 
        'imagemin',
        'copy:all'
    ]);

};
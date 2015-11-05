/*
 * grunt-init-smart
 * https://github.com/hankewins/smart-init-build
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
                    dest: staticResPath + '/call'
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
                    config: './assets/src/config.rb'
                }
            }
        },

        // 压缩JS
        uglify: {
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
                tasks: ['compass', 'cssmin']
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
        },
        requirejs: {
            compile: {
                options: {
                    baseUrl: "assets/js",
                    dir: 'build/js',
                    removeCombined: true,
                    mainConfigFile: "assets/js/common.js",
                    modules: [{
                        //module names are relative to baseUrl/paths config
                        name: 'main-index',
                        include: [],
                        exclude: ['common']
                    }]
                }
            }
        }
    });


    //默认被执行的任务列表
    grunt.registerTask('default', ['compass', 'cssmin', 'uglify', 'watch']);
    
    grunt.registerTask('team', [
        'copy', //复制文件
        'concat', //合并文件
        'imagemin', //图片压缩
        'cssmin', //CSS压缩
        'uglify', //JS压缩
        'usemin', //HTML处理
        'htmlmin' //HTML压缩
    ]);

    // 测试
    grunt.registerTask('test', [
        'clean:all', 
        'compass', 
        'copy:html', 
        'cssmin', 
        'uglify', 
        'usemin'
    ]);

    // 发布
    grunt.registerTask('publish', [
        'clean:all', 
        'copy:html', 
        'cssmin', 
        'uglify', 
        'imagemin', 
        'copy:all'
    ]);

};
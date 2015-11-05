/*
 * grunt-init-smart
 * https://github.com/hankewins/smart-init-build
 *
 * Copyright (c) 2015 hankewins
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '创建smartTeam专属模板，带文件编译、合并、压缩以及图片优化等.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '下面将通过Grunt-init-smart自动生成项目结构：';

// Template-specific notes to be displayed after question prompts.
exports.after = '请先执行npm install, 之后再使用grunt.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done){
    // See the "Inside an init template" section.
    init.process({}, [
        init.prompt('name'),
        init.prompt('title'),
        init.prompt('description', 'smartTeam项目结构'),
        init.prompt('version', '1.0.0'),
        init.prompt('author_name'),
        init.prompt('author_email'),
    ], function(err, props){

        props.keywords = [];

        // 需要拷贝处理的文件，这句一般不用改它
        var files = init.filesToCopy(props);

        // 实际修改跟处理的文件，noProcess表示不进行处理
        init.copyAndProcess(files, props, {noProcess: 'libs/**'});

        // 生成package.json，供Grunt、npm使用
        init.writePackageJSON('package.json', {
            name: 'SmartTeam-PROJ',
            version: '0.0.0-ignored',
            npm_test: 'grunt qunit',
            node_version: '>= 0.10.0',
            devDependencies: {
                "grunt-contrib-compass": "^1.0.1",
                "grunt-contrib-concat": "~0.4.0",
                "grunt-contrib-cssmin": "^0.12.2",
                "grunt-contrib-jshint": "~0.10.0",
                "grunt-contrib-uglify": "~0.5.0",
                "grunt-contrib-watch": "~0.6.1",
                "grunt-contrib-clean": "^0.6.0",
                "grunt-contrib-concat": "^0.5.1",
                "grunt-contrib-copy": "^0.8.2",
                "grunt-contrib-imagemin": "^0.9.4",
                "load-grunt-tasks": "^3.1.0",
                "time-grunt": "^1.1.1"
            },
        });

        // All done!
        done();
    });
};
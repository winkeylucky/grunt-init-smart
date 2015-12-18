/*
 * grunt-init-smart
 * https://github.com/hankewins/grunt-init-smart
 *
 * Copyright (c) 2015 hankewins
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '自动生成项目模板，自带合并压缩等.';

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
        init.prompt('description', 'Grunt-init-smart自动生成项目基本结构！'),
        init.prompt('version', '1.0.0'),
        init.prompt('author_name'),
        init.prompt('author_email'),
    ], function(err, props){

        props.keywords = [];

        // 需要拷贝处理的文件，这句一般不用改它
        var files = init.filesToCopy(props);

        // 实际修改跟处理的文件，noProcess表示不进行处理
        init.copyAndProcess(files, props/*, {noProcess: 'libs/**'}*/);

        // 生成package.json，供Grunt、npm使用
        init.writePackageJSON('package.json', {
            name: props.name,
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
                "grunt-contrib-copy": "^0.8.2",
                "grunt-usemin": "^3.1.1",
                "grunt-contrib-imagemin": "~1.0.0",
                "load-grunt-tasks": "^3.1.0",
                "time-grunt": "^1.1.1"
            },
        });

        // All done!
        done();
    });
};
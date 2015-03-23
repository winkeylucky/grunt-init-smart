/*
 * smart-init-build
 * https://github.com/hankewins/smart-init-build
 *
 * Copyright (c) 2015 hankewins
 * Licensed under the MIT license.
 */

'use strict';

// Basic template description.
exports.description = '创建一个smart项目.';

// Template-specific notes to be displayed before question prompts.
exports.notes = '';

// Template-specific notes to be displayed after question prompts.
exports.after = '请先执行npm install, 之后再使用grunt.';

// Any existing file or directory matching this wildcard will cause a warning.
exports.warnOn = '*';

// The actual init template.
exports.template = function(grunt, init, done){
    // See the "Inside an init template" section.
    init.process({}, [
        init.prompt('name'),
        init.prompt('author_name'),
        init.prompt('author_url'),
        init.prompt('version', '0.0.1'),
        {
            name: 'zetpo',
            message: 'Do you want to use zepto?',
            default: 'Y/n'
        },
        {
            name: 'css_tool',
            message: 'Which one do you use, compass or stylus?',
            default: 'C/s'
        },
        {
            name: 'merge_file',
            message: 'Do you want to merge css/js files?',
            default: 'Y/n'
        },
        {
            name: 'static_path',
            message: 'Set the static path, such as "../../repos".',
            default: ''
        }
    ], function(err, props){
        props.name = props.name.toLocaleLowerCase();
        // 默认依赖的grunt-contrib
        props.devDependencies = {
            "grunt": "~0.4.5",
            //"grunt-contrib-compass": "^1.0.1",
            //"grunt-contrib-concat": "~0.4.0",
            //"grunt-contrib-cssmin": "^0.12.2",
            "grunt-contrib-jshint": "~0.10.0",
            "grunt-contrib-uglify": "~0.5.0",
            "grunt-contrib-watch": "~0.6.1"

        };

        // 默认使用compass:0 stylus:1
        var compile_css = '' || props.css_tool === 'c' ? 0 : 1;

        if(compile_css === 1){
            props.devDependencies['grunt-contrib-stylus'] = '~0.10.0';
        } else {
            props.devDependencies['grunt-contrib-compass'] = '^1.0.1';
        }

        var folders = ['assets/css','assets/pic','assets/img','assets/js'];
        var staticAssets  = './';
        var staticResPath = props.static_path + 'apps/' + props.name + (props.subname ? '/' + props.subname : '') + '/';
        var staticSysPath = props.static_path + 'sys/';

        var files = init.filesToCopy(props);

        for(var f in files){
            console.log(f);
        }

        // Actually copy (and process) files.
        for(var i=0, len=folders.length; i<len; i++){
            //console.log('---'+staticResPath+folders[i]+'---');
            grunt.file.mkdir(staticAssets+folders[i]);
        }

        init.copyAndProcess(files, props);

        // Generate package.json file.
        init.writePackageJSON('package.json', props);

        // All done!
        done();
    });
};
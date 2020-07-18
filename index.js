const $ = require('jquery');
require('jstree');
const nodePath = require('path');
const fs = require('fs');

$(document).ready(async function () {
    let editor = await createEditor();
    console.log(editor);

    let currPath = process.cwd();
    console.log(currPath);

    let data = [];
    let baseobj = {
        id : currPath,
        parent : '#',
        text : getNameFrompath(currPath)
    }
    let rootChildren = getCurrentDirectories(currPath);
    data = data.concat(rootChildren);
    data.push(baseobj);

    $('#jstree').jstree({
        "core": {
            "check_callback": true,
            "data": data
        }
    }).on('open_node.jstree', function (e, data) {
        // console.log(data.node.children);

        data.node.children.forEach(function (child) {

            let childDirectories = getCurrentDirectories(child);

            childDirectories.forEach(function (directory) {

                $('#jstree').jstree().create_node(child, directory, "last");
            })

        })
    });

})

function getNameFrompath(path) {
    return nodePath.basename(path);
}

function getCurrentDirectories(path) {

    if (fs.lstatSync(path).isFile()) {
        return [];
    }

    let files = fs.readdirSync(path);
    // console.log(files);

    let rv = [];
    for (let i = 0; i < files.length; i++) {
        let file = files[i];

        rv.push({
            id: nodePath.join(path, file),
            parent: path,
            text: file
        })
    }

    return rv;
}

function createEditor() {
//    https://github.com/microsoft/monaco-editor-samples/blob/master/browser-amd-editor/index.html
    return new Promise(function (resolve, reject) {
        let monacoLoader = require('./node_modules/monaco-editor/min/vs/loader.js');
        //changes glogal require so create monaco
        monacoLoader.require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' } });

        monacoLoader.require(['vs/editor/editor.main'], function () {
            var editor = monaco.editor.create(document.getElementById('editor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'javascript'
            });

            resolve(editor);
        });
    })
}
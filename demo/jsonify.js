/*
 * This file is part of node-endicia-mac
 *
 * Copyright 2011 Danny Berger <dpb587@gmail.com>
 *
 * This source file is subject to the MIT license that is
 * bundled with this source code in the LICENSE file.
 */

var endicia = require('..'),
    fs = require('fs');

function run (data) {
    endicia.send(
        data,
        function (err, packages, raw) {
            if (err) {
                throw err;
            }
            
            console.log(JSON.stringify(packages));
        }
    );
}

if (process.argv[2] == undefined) {
    var data = [];
    
    process.stdin.setEncoding('utf8');
    
    process.stdin
        .on('data', function (chunk) {
            data.push(chunk);
        })
        .on('end', function () {
            // bug workaround - https://github.com/joyent/node/issues/861
            // reopen an stdin fd, otherwise child_process will use the closed one and error
            process.binding('stdio').openpty();
            
            run(data.join(''));
        });
        
    process.stdin.resume();
} else {
    fs.readFile(process.argv[2], 'utf8', function (err, data) {
        if (err) {
            console.error('Unable to read file: ' + err);
            
            process.exit(255);
        }
        
        run(data);
    });
}
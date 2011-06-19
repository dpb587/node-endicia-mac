/*
 * This file is part of node-endicia-mac
 *
 * Copyright 2011 Danny Berger <dpb587@gmail.com>
 *
 * This source file is subject to the MIT license that is
 * bundled with this source code in the LICENSE file.
 */

var spawn = require('child_process').spawn,
    xml = require('node-xml');

function parse (data, callback) {
    var p = new xml.SaxParser(
        function (parser) {
            var packages = {},
                pcount = 0,
                pcurr = null,
                pprop = null;
            
            parser.onStartElementNS(
                function (elem, attrs, prefix, uri, namespace) {
                    if (elem == 'DAZzle') {
                        // ignore root
                    } else if (elem == 'Package') {
                        pcurr = pcount ++;
                        pprop = null;
                        
                        attrs.forEach(function (v) {
                            if (v[0] == 'ID') {
                                pcurr = v[1];
                            }
                        });
                        
                        packages[pcurr] = {};
                    } else if (pcurr !== null) {
                        pprop = elem;
                    }
                }
            );
            
            parser.onEndElementNS(
                function () {
                    pprop = null;
                }
            );
            
            parser.onCharacters(
                function (chars) {
                    if (pprop) {
                        switch (pprop) {
                            case 'Balance':
                            case 'FinalPostage':
                            case 'RetailPostage':
                            case 'WeightOz':
                                chars = parseFloat(chars);
                                
                                break;
                                
                            case 'Zone':
                                chars = parseInt(chars);
                                
                                break;
                                
                            case 'PostmarkDate':
                                chars = new Date(
                                    chars.substr(0, 4), parseInt(chars.substr(4, 2)) - 1, chars.substr(6, 2)
                                );
                                
                                break;
                                
                            case 'TransactionDateTime':
                                chars = new Date(
                                    chars.substr(0, 4), parseInt(chars.substr(4, 2)) - 1, chars.substr(6, 2),
                                    chars.substr(8, 2), chars.substr(10, 2), chars.substr(12, 2)
                                );
                                
                                break;
                        }
                        
                        if (packages[pcurr][pprop] === undefined) {
                            packages[pcurr][pprop] = chars;
                        } else {
                            packages[pcurr][pprop] += chars;
                        }
                    }
                }
            );
            
            parser.onEndDocument(
                function () {
                    callback(null, packages);
                }
            );
            
            parser.onError(
                function (msg) {
                    var e = new Error(msg);
                    e.code = 'BADXML';
                    
                    callback(e);
                }
            );
        }
    );
    
    p.parseString(data);
}

function send (data, callback) {
    var endicia = spawn(module.exports.bin);
    
    endicia.stdout.setEncoding('utf8');
    endicia.stderr.setEncoding('utf8');
    
    var stderr = '',
        stdout = '';
    
    endicia.on('exit', function (code) {
        if (code == 0) {
            parse(stdout, function (err, data) {
                callback(err, data, stdout);
            })
        } else {
            var e = new Error(stderr);
            e.code = 'BADEXIT';
            
            callback(e);
        }
    });
    
    endicia.stdout.on('data', function (data) {
        stdout += data;
    });
    
    endicia.stderr.on('data', function (data) {
        stderr += data;
    });
    
    process.nextTick(function () {
        endicia.stdin.write(data);
    });
    
    return endicia;
}

// ------------------------------------------------------------------------------------------------------------------ //

module.exports = {
    bin: 'endiciatool',
    parse: parse,
    send: send
};

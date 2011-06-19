/*
 * This file is part of node-endicia-mac
 *
 * Copyright 2011 Danny Berger <dpb587@gmail.com>
 *
 * This source file is subject to the MIT license that is
 * bundled with this source code in the LICENSE file.
 */

var endicia = require('..');

var dazzle = [
    '<DAZzle Prompt="NO" Test="YES">',
        '<Package ID="12345">',
            '<MailClass>PRIORITY</MailClass>',
            '<PackageType>RECTPARCEL</PackageType>',
            '<WeightOz>16</WeightOz>',
            
            '<ToName>Endicia</ToName>',
            '<ToAddress1>385 Sherman Ave</ToAddress1>',
            '<ToCity>Palo Alto</ToCity>',
            '<ToState>CA</ToState>',
            '<ToPostalCode>94306</ToPostalCode>',
        '</Package>',
    '</DAZzle>'
].join('\n');

endicia.send(
    dazzle,
    function (err, packages, raw) {
        if (err) {
            throw err;
        }
        
        console.log(raw);
        console.dir(packages);
    }
);

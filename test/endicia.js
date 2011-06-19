/*
 * This file is part of node-endicia-mac
 *
 * Copyright 2011 Danny Berger <dpb587@gmail.com>
 *
 * This source file is subject to the MIT license that is
 * bundled with this source code in the LICENSE file.
 */

var assert = require('assert'),
    endicia = require('..'),
    vows = require('vows');

vows.describe('endicia').addBatch({
    'Valid parses' : {
        topic : function () {
            endicia.parse([
                '<DAZzle>',
                    '<Package ID="10101">',
                        '<Balance>1.23</Balance>',
                        '<FinalPostage>1.24</FinalPostage>',
                        '<RetailPostage>1.25</RetailPostage>',
                        '<WeightOz>1.3</WeightOz>',
                        '<TransactionID>1234567890123456789012</TransactionID>',
                        '<Zone>1</Zone>',
                        '<PostmarkDate>20110618</PostmarkDate>',
                        '<TransactionDateTime>20110618012345</TransactionDateTime>',
                        '<UnknownProperty>Mystery Machine</UnknownProperty>',
                    '</Package>',
                '</DAZzle>'
            ].join(''), this.callback);
        },
        'give no error' : function (err, packages) {
            assert.strictEqual(err, null);
        },
        'talk about package 10101' : function (err, packages) {
            assert.equal(typeof packages, 'object');
        },
        'converts Balance to float' : function (err, packages) {
            assert.strictEqual(packages[10101].Balance, 1.23);
        },
        'converts FinalPostage to float' : function (err, packages) {
            assert.strictEqual(packages[10101].FinalPostage, 1.24);
        },
        'converts RetailPostage to float' : function (err, packages) {
            assert.strictEqual(packages[10101].RetailPostage, 1.25);
        },
        'converts WeightOz to float' : function (err, packages) {
            assert.strictEqual(packages[10101].WeightOz, 1.3);
        },
        'converts int values' : function (err, packages) {
            assert.strictEqual(packages[10101].Zone, 1);
        },
        'converts PostmarkDate to date' : function (err, packages) {
            assert.ok(packages[10101].PostmarkDate instanceof Date);
            assert.equal(packages[10101].PostmarkDate.valueOf(), new Date(2011, 5, 18).valueOf());
        },
        'converts TransactionDateTime to date' : function (err, packages) {
            assert.ok(packages[10101].TransactionDateTime instanceof Date);
            assert.equal(packages[10101].TransactionDateTime.valueOf(), new Date(2011, 5, 18, 1, 23, 45).valueOf());
        },
        'does not convert TransactionID' : function (err, packages) {
            // stay a string; big numbers can be potentially problematic (e.g. 1.2345678901234568e+21)
            assert.strictEqual(packages[10101].TransactionID, '1234567890123456789012');
        },
        'includes unrecognized elements' : function (err, packages) {
            assert.strictEqual(packages[10101].UnknownProperty, 'Mystery Machine');
        }
    },
    'Invalid parses' : {
        topic: function () {
            endicia.parse([
                '<DAZzle>',
                    '<Package ID="10101">',
                        '<WeightOz>1.4</OzWEIGHT>',
                    '</Package>',
                '<DAZzle>'
            ].join(''), this.callback);
        },
        'give BADXML Error' : function (err, packages) {
            assert.ok(err instanceof Error);
            assert.equal(err.code, 'BADXML');
        }
    }
}).export(module);
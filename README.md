node-endicia-mac
================

A simple option for interacting with [Endicia for Mac](http://mac.endicia.com) by printing and responding to postage
using their [XML Interface](http://mac.endicia.com/extras/xml/). This makes it easy for integrating into existing
workflows like:

 * listening and responding to a postage queue server as packages are being prepared
 * printing labels and then sending back the postage and tracking information to the database

This project is in no way affiliated with or endorsed by [Endicia](http://www.endicia.com/).



Requirements
------------

 * Endicia for Mac -- installed and setup with an active account
 * `endiciatool` -- installed from the Extras folder of the Endicia for Mac disk image
 * node modules ([`node-xml`](https://github.com/robrighter/node-xml)) -- install with `npm install node-xml` or
   `git submodule init`



Usage
-----

    var xml = '<DAZzle><Package ID="12345">...</DAZzle>';
    require('endicia-mac').send(xml, function (err, packages) {
        if (err) throw err;
        
        console.log('Tracking #' + packages[12345].PIC);
        console.log('Postage: $' + packages[12345].FinalPostage);
    });

Call the `send` method, passing your DAZzle XML request and a callback function. The callback may receive three
arguments: `err`, `packages`, and `raw`. If an error occurred, `err` will be non-null and an `Error` object. The `raw`
argument is the untouched STDOUT from `endiciatool`. The `packages` argument will be a JavaScript object of package IDs
and their parsed output values, similar to:

    { '12345': 
       { Status: 'Success',
         PIC: '9412312123456123456781',
         RetailPostage: 4.68,
         FinalPostage: 4.56,
         Balance: 234.56,
         TransactionID: 0,
         TransactionDateTime: Tue, 19 Jun 2011 01:23:45 GMT,
         PostmarkDate: Mon, 18 Jun 2011 04:00:00 GMT,
         WeightOz: 16,
         Zone: 7 } }

If `endiciatool` cannot be found in `$PATH`, you may explicitly specify it:

    var endicia = require('endicia-mac');
    endicia.bin = '/usr/local/endicia/bin/endiciatool';
    endicia.send(...);



Demo
----

While these have the Test flag set to prevent them from using real postage, they will still try to print the test label.

**easy.js** - super simple, static example showing how to invoke the module

**jsonify.js** - very similar to the core `endiciatool` but will output the JSON instead of XML. Will accept the DAZzle
XML via STDIN or as a file path in the first argument

    $ node ./demo/jsonify.js ./demo/demo.xml
    {"12345":{"Status":"Success","PIC":"9412312123456123456781","RetailPostage":4.68,"FinalPostage":4.56,"Balance":234.56,"TransactionID":"0","TransactionDateTime":"2011-06-19T01:23:45.000Z","PostmarkDate":"2011-06-18T04:00:00.000Z","WeightOz":16,"Zone":7}}



Unit Tests
----------

To run, you will need [`vows`](https://github.com/cloudhead/vows) - use `npm install vows` or `git submodule init`

    $ [./node_modules/vows/bin/]vows ./test/endicia.js



License
-------

Copyright 2011 Danny Berger &lt;[dpb587@gmail.com](mailto:dpb587@gmail.com)&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit
persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

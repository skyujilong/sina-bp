'use strict';

const argv = require('yargs')
.help()
.alias('help','h')
.version()
.alias('version','v')
.option('width',{
    alias:'w',
    describe:'宽度',
    type:'string'
})
.demandOption(['width'],'please provide with arguments')
.usage('usage: $0 -w [num] -s [num]')
.argv;

console.log(argv);

var nconf = require('nconf');

nconf.argv()
     .env()
     .file({ file: 'config.json' })
     .defaults({ PORT: '9000' });
module.exports = nconf;

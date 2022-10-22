const app = require('./app');
const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

require('dotenv').config();

server.listen(port, () => console.log('Listening to http://localhost:' + port ));

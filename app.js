const express = require('express');
const fs = require('fs');
let CentersAll = require('./CentersAll.json');

const app = express();
app.get('/', function(req, resp){
    resp.send('Sah Brah')
})
 
/** 
http = require("http");
http.createServer(function (request, response){
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end('Whats up fuckersss!\n');
}).listen(8080);
console.log('Server running at http://127.0.0.1:8080/');
app.listen(8090);
*/ 

module.exports = app


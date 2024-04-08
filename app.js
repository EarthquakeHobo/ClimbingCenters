const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('client'));

let CentersAll = require('./CentersAll.json');

app.get('/CentersAll', function(req, resp){
    resp.send(CentersAll);});

app.get('/NameSearch/:name', function (req, resp){
    let CenterName = req.params.name;
    let found = false; 
    for (const c of CentersAll){ //n.b. using const prevents issues with c being predefined. of instead of in returns valuess instead of index
        console.log('Looking for ' + CenterName);
        if (c.name.toLowerCase() == CenterName.toLowerCase()){
            console.log("found " + CenterName + " in Database");
            resp.send(c);
            found = true;
        }}
    if (!found) {
        resp.send ('Unknown Center, consider adding it to the databse')
    };
    
});

app.get('/CenterDiscountSearch', function (req, resp) {
    const dday = req.query.DDay;
    const searchResults = [];
    for (const c of CentersAll) {
        if (c.DDay === dday) {
            searchResults.push(c);
        }
    };
    resp.send(searchResults);
  });

 
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


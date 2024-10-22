const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.static('client'));
app.use(express.json());

const CentersJSON = ('./CentersAll.json')
const CentersAll = require(CentersJSON);


app.get('/DiscountOn', function (req, resp) {
    const dday = req.query.DDay;
    console.log(dday);
    const searchResults = [];
    for (const c of CentersAll) {
        if (c.DDay === dday) {
            searchResults.push(c);
        }
    };
    resp.send(searchResults);
  });


app.post('/addcenter', function (req, resp) {
    const name = req.body.name;
    const DDay = req.body.DDay;
    const Pin = req.body.Pin;
    const newCenter = {name,DDay,Pin};
    CentersAll.push(newCenter);
    resp.send('Added new center');
    updateCenters;
  });


app.delete('/deleteCenter/:index', (req, res) => {
    const i = req.params.index;
    const tobedeleted = CentersAll[i]
    CentersAll.splice(i, 1);
    console.log ("Deleted ", tobedeleted)
    updateCenters;
});

 
app.patch('/newpin/:index', (req,res) => {
    const i = req.params.index;
    const Pin = req.body.Pin;
    CentersAll[i].Pin = Pin;
    console.log ("Pin assigned to", CentersAll[i]);
    console.log (CentersAll);
    updateCenters;
});


app.get('/ping', (req, res) => {
    res.status(200).json({ message: 'Server is running' });
  });
  


//unused
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


app.get('/CentersAll', function(req, resp){
    resp.send(CentersAll);
    const CenterProperties = Object.keys('CentersJSON')    
});

async function updateCenters(){
    fs.writeFileSync('./CentersAll.json', JSON.stringify(CentersAll))
};



module.exports = app

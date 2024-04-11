async function renderpins(){
    const rawdata = await fetch ('http://127.0.0.1:8090/CentersAll');
    const rawtext = await rawdata.text();
    const CenterDisplayy = JSON.parse(rawtext);
    for (let i=0; i<CenterDisplayy.length; i++){
        const center = CenterDisplayy[i];
        const {name , DDay} = center;
        const Longitude = center.Pin[0];
        const Latitude = center.Pin[1];
        const PopUp = `<p> ${name}</p> <sup>Discount on ${DDay}</sup>`
        console.log(Longitude)
        const pin = L.marker([Longitude, Latitude]).addTo(map);
        pin.bindPopup (PopUp)}
}
renderpins();

async function newpin(i){
    const PinInput = prompt("On Google Maps, (right)click its pin to copy Longitude,Latitude ", "51.543, -0.1242");
        const Coordinates = PinInput.split(',');
        const Long = parseFloat(Coordinates[0]);
        const Lang = parseFloat(Coordinates[1]);
        const newpin = {Pin:[Long,Lang]};
    try {
        const rawdata = await fetch (`http://127.0.0.1:8090/newpin/${i}`, {
        method: 'PATCH',
        body: JSON.stringify(newpin),
        headers: {
            'Content-Type': 'application/json'
        } 
        });
    } catch (error){console.log("error assigning new pin", error)}
    renderpins();
    console.log("CentersAll");
    }   





async function renderCenters(){
    const rawdata = await fetch ('http://127.0.0.1:8090/CentersAll');
    const rawtext = await rawdata.text();
    const CenterDisplayy = JSON.parse(rawtext);
    let CDhtml = '';
        for (let i=0; i<CenterDisplayy.length; i++){
            const center = CenterDisplayy[i];
            const {name , DDay} = center;
            const CDHTML = ` 
            <div>${name} </div> 
            <div>${DDay}</div>  
            <button 
                onclick = "CenterDelete(${i}); renderCenters();" 
                class="DeleteButton" style = "border: none; padding-top: 5px; padding-bottom: 5px;"> Delete 
            </button>
            <button 
            onclick = "newpin(${i})"
            style = "background-color: rgb(30, 26, 26); color: white;"> 
            Pin on Map </button>
            `
            CDhtml += CDHTML;
            }
    document.getElementById('CenterSubs').innerHTML = CDhtml; 
    }

async function CenterDelete(a) {
    try {
        const response = await fetch(`/deleteCenter/${a}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error deleting center:', error);
    }
    renderpins();
}

/* 
const DeleteButton = document.getElementById("DeleteButton"); 
DeleteButton.addEventListener ('click', async function (){
try {
    const response = await fetch(`/deleteCenter/${i}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    renderCenters();
} 
catch (error) {
    console.error('Error deleting center:', error);
}
});
*/





    
/* Personal Notes:             
renderCenters() at start to start off with objects saved here, works because of Hoisting
Shortened following 
    const name = center.name;
    const DDay = center.DDay; 
    and     const CDHTML = '<p>' + center + DDay '</p>', 
${} allows embedded expression from outside ''
innerHTML seperated into 4 elements (2 divs 1 button) for CSS grid structuring
*/

const addbutton = document.getElementById('AddButton'); 
addbutton.addEventListener('click', async function(event) {
    const Subs = document.querySelector('.CenterInput');
    const CenterName = Subs.value;
    const DDSubs = document.getElementById('DiscountDays');
    const DD = DDSubs.value;
    //above: name and discounted days of submitted centers. below: true/false 
    const Discount = document.getElementById('Discount');
    const DDexist = Discount.value;  
    // Above used later for no discount selected 
    const newCenterObject = {
        name: CenterName, 
        DDay: DD};
    try {
        event.preventDefault();
        let response = await fetch('addcenter', {
            method: "POST", 
            body: JSON.stringify(newCenterObject), 
            headers: {
                "Content-Type": "application/json"}
            });
        console.log (newCenterObject)
        }
    catch(error) {console.log("failed to add")};
    Subs.value = '';
    console.log("Did something");
    await renderCenters();
    });


    
function toggleCentersAll(){
    document.getElementById('CenterSubs').classList.remove('HiddenSelect');
    document.getElementById('CenterSubs').classList.add('subsgrid');
    console.log("clicked");
}



function toggleDays(a) {
    console.log(a.value);
    if (a.value == 1) {
        document.getElementById('DiscountDays').classList.remove('HiddenSelect');
        document.getElementById('changinggrid').classList.add('subsgridyep');
        document.getElementById('changinggrid').classList.remove('subsgrid');
    } 
    else {       
        document.getElementById('DiscountDays').classList.add('HiddenSelect');
        document.getElementById('changinggrid').classList.remove('subsgridyep');
        document.getElementById('changinggrid').classList.add('subsgrid');
        //classlist checks if that class exists already to avoid errors
    }
}


//Below for Interactive Map. 
/* Resources: Leafletjs.com provided L.objects and functions I used exclusively within the interactive map, and Openstreetmap.org provided the map layer itself */
const map = L.map('LCCMap').setView([51.5, -0.09], 10);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//Above code taken from leaflet.js quickstart guide: setView ([center coordinates, zoom level])




document.getElementById("AboutMap").addEventListener("click", displayAbout)
function displayAbout(){
    const text = document.getElementById("AboutText");
    const button = document.getElementById("AboutMap")
    button.style.display = "none";
    text.style.display = "block";
}





document.addEventListener('DOMContentLoaded', renderCenters, renderpins);

/*
function Center(name, DDay, Pin) {
    this.name = name;
    this.DDay = DDay; 
    this.Pin = Pin;
    console.log (typeof(Pin));
};

let Yonder = new Center("Yonder", "Tuesday & Friday", ['51.59004849809571', '-0.040686369315706']);
let Harrowall = new Center("Harrowall", "Friday", ['51.58108375390574', '-0.343247901104178']);

*/
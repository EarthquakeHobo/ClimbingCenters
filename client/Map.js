/** Greetings! 
 */

/** Object constructor retroactively added to allow easier expanding of CenterDisplay 
 * @constructor - Center
 * @param {string} name - name of Climbing center or buildering spot
 * @param {string} Dday - Day on which center has super off peak/student discount
 * @param {object} Pin - Array containing Long and Lat, referenced in functions newpin() and renderpins() */
function Center(name, DDay, Pin) {
    this.name = name;
    this.DDay = DDay; 
    this.Pin = Pin;
    console.log (typeof(Pin));
};

let Yonder = new Center("Yonder", "Tuesday & Friday", ['51.59004849809571', '-0.040686369315706']);
let Harrowall = new Center("Harrowall", "Friday", ['51.58108375390574', '-0.343247901104178']);


/** Array of Objects (climbing centers), as the dataset referenced in other functions and used for further manipulation. 
 * @typedef {Object[]} CenterDisplay
 */
const CenterDisplay = [{
    name: 'VauxEast',
    DDay: 'Monday',
    Pin: ['51.492', '-0.115']
 }, 
{
    name: 'White Spider',
    DDay: 'Wednesday',
    Pin: ['51.37241614966599', '-0.2912346879825387']
},
{
    name: 'CroyWall',
    DDay: 'Wednesday',
    Pin: ['51.374141855732276', '-0.11569046330300277']
},
Yonder, 
Harrowall,
];



/**
 * @function
 * @param {object} - CenterDisplay[i] - adds Pin properties to the Climbing center objects within the CenterDisplay dataset
 */
function newpin(a){
    const PinInput = prompt("On Google Maps, (right)click its pin to copy Longitude,Latitude ", "51.543, -0.1242");
    if (PinInput !== null) {
    const Coordinates = PinInput.split(',');
    const Long = Coordinates[0];
    const Lang = Coordinates[1];
    a.Pin = [Long,Lang];
    console.log (CenterDisplay);
    console.log (a);
    }
    renderpins();
}

/** Generates the HTML that goes into the .CenterSubs div element
 * @function
 * @returns {HTML}
 */
renderCenters()
function renderCenters(){
    let CDhtml = '';
        for (let i=0; i<CenterDisplay.length; i++){
            const center = CenterDisplay[i];
            const {name , DDay} = center;
            const CDHTML = ` 
            <div>${name} </div> 
            <div>${DDay}</div>  
            <button 
                onclick = "CenterDisplay.splice(${i}, 1); renderCenters();" 
                id="DeleteButton" style = "border: none; padding-top: 5px; padding-bottom: 5px;"> Delete 
            </button>
            <button 
            onclick = "newpin(CenterDisplay[${i}])"
            style = "background-color: rgb(30, 26, 26); color: white;"> 
            Pin on Map </button>
            `
            CDhtml += CDHTML;
            }
    document.querySelector('.CenterSubs').innerHTML = CDhtml 
    }


    
/* Personal Notes:             
renderCenters() at start to start off with objects saved here, works because of Hoisting
Shortened following 
    const name = center.name;
    const DDay = center.DDay; 
    and     const CDHTML = '<p>' + center + DDay '</p>', 
${} allows embedded expression from outside ''
innerHTML seperated into 4 elements (2 divs 1 button) for CSS grid structuring
*/

/** Add a Center to the List via pushing to CenterDisplay
 * @param {string} CenterName - Added via user input 
 * @param {string} DDSubs - Discounted days selected via dropdown menu
 * @param {boolean} DDexist - Reflects whether user selected "Yep" or "Nope" for Special Discounts
 */

function AddCenter () {
    const Subs = document.querySelector('.CenterInput');
    const CenterName = Subs.value;
    const DDSubs = document.getElementById('DiscountDays');
    const DD = DDSubs.value;
    //above: name and discounted days of submitted centers. below: true/false 
    const Discount = document.getElementById('Discount');
    const DDexist = Discount.value;    

    if (DDexist == 1){
    CenterDisplay.push({
        name: CenterName,
        DDay: DD,
        });
        }
    else {
    CenterDisplay.push({
        name: CenterName,
        DDay: "-",
        });
        }
    Subs.value = '';
    renderCenters();
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



function renderpins(){
    for (let i=0; i<CenterDisplay.length; i++){
        const center = CenterDisplay[i];
        const {name , DDay} = center;
        const Longitude = center.Pin[0];
        const Latitude = center.Pin[1];
        const PopUp = `<p> ${name}</p> <sup>Discount on ${DDay}</sup>`

        console.log(Longitude)
        const pin = L.marker([Longitude, Latitude]).addTo(map);
        pin.bindPopup (PopUp)}
}
renderpins()

document.getElementById("AboutMap").addEventListener("click", displayAbout)
function displayAbout(){
    const text = document.getElementById("AboutText");
    const button = document.getElementById("AboutMap")
    button.style.display = "none";
    text.style.display = "block";
}


// https://registry.gsg.org.uk/sr/registrysearch.php 
async function newpin(i){
	const PinInput = prompt("On Google Maps, (right)click its pin to copy Longitude,Latitude ", "51.543, -0.1242");
	const Coordinates = PinInput.split(",");
	const Long = parseFloat(Coordinates[0]);
	const Lang = parseFloat(Coordinates[1]);
	const newpin = {Pin:[Long,Lang]};
	try {
		const rawdata = await fetch (`http://127.0.0.1:8090/newpin/${i}`, {
			method: "PATCH",
			body: JSON.stringify(newpin),
			headers: {
				"Content-Type": "application/json"
			} 
		});
	} catch (error){console.log("error assigning new pin", error);}
	renderpins();
	console.log("CentersAll");
}   


async function renderCenters(){
	const rawdata = await fetch ("http://127.0.0.1:8090/CentersAll");
	const rawtext = await rawdata.text();
	const CenterDisplayy = JSON.parse(rawtext);
	let CDhtml = "";
	for (let i=0; i<CenterDisplayy.length; i++){
		const center = CenterDisplayy[i];
		const {name , DDay} = center;
		const CDHTML = ` 
            <div>${name} </div> 
            <div>${DDay}</div>  
            <button 
                onclick = "CenterDelete(${i}); renderCenters(); renderpins();" 
                class="DeleteButton" style = "border: none; padding-top: 5px; padding-bottom: 5px;"> Delete 
            </button>
            <button 
            onclick = "newpin(${i}); renderCenters(); renderpins();"
            style = "background-color: rgb(30, 26, 26); color: white;"> 
            Pin on Map </button>
            `;
		CDhtml += CDHTML;
	}
	document.getElementById("CenterSubs").innerHTML = CDhtml; 
}


async function CenterDelete(a) {
	const password = prompt("The password is password");
	if (password === "password"){
		try {
			await fetch(`/deleteCenter/${a}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json"
				}
			});
		} catch (error) {
			console.error("Error deleting center:", error);
		}
		renderCenters();
		renderpins();           }
	else {alert("Incorrect Password");}
}


async function renderpins(){
	const rawdata = await fetch ("http://127.0.0.1:8090/CentersAll");
	const rawtext = await rawdata.text();
	const CenterDisplayy = JSON.parse(rawtext);
	for (let i=0; i<CenterDisplayy.length; i++){
		const center = CenterDisplayy[i];
		const {name , DDay} = center;
		const Longitude = center.Pin[0];
		const Latitude = center.Pin[1];
		const PopUp = `<p> ${name}</p> <sup>Discount on ${DDay}</sup>`;
		console.log(Longitude);
		const pin = L.marker([Longitude, Latitude]).addTo(map);
		pin.bindPopup (PopUp);}
}
renderpins();


const DDSearchForm = document.getElementById("DDSearch");
DDSearchForm.addEventListener("submit", async function(event){
	event.preventDefault();
	const formdata = new FormData(DDSearchForm);
	const searchParams = new URLSearchParams(formdata);
	try{    
		const results = await fetch ("http://127.0.0.1:8090/DiscountOn?" + searchParams.toString());
		const resultsjson = await results.json();
		document.getElementById("DDSearchResults").innerHTML = DDfilter(resultsjson);
	} catch (error) {alert (error);}
});


function DDfilter (centers){
	let table = "<table style = 'width = 100%; border-collapse: collapse;' >";
	table += "<tr><th>Center</th><th>Coordinates</th><th>Discounted On</th></tr>";
	for(let center of centers){
		const Pinshort = center.Pin.map(n => parseFloat(n).toFixed(2));
		table += `<tr style = 'border: 1px solid black;'> <td>${center.name}</td> <td style='padding-left: 12px; padding-right: 12px'>${Pinshort}</td> <td>${center.DDay}</td><td></tr>`;
	}
	table += "</table>";
	return table;
}


const addbutton = document.getElementById("AddButton"); 
addbutton.addEventListener("click", async function(event) {
	const Subs = document.querySelector(".CenterInput");
	const CenterName = Subs.value;
	const DDSubs = document.getElementById("DiscountDays");
	const DD = DDSubs.value;
	//above: name and discounted days of submitted centers. below: true/false 
	const Discount = document.getElementById("Discount");
	const DDexist = Discount.value;  
	const defaultpin = ["0.0000, 0.0000"];
	// Ternary operator below 
	const newCenterObject = DDexist == 1
		?
		{name: CenterName, 
			DDay: DD,
			Pin: defaultpin}
		:
		{name: CenterName,
			DDay: "n/a",
			Pin: defaultpin};
	try {
		event.preventDefault();
        await fetch("addcenter", {
			method: "POST", 
			body: JSON.stringify(newCenterObject), 
			headers: {
				"Content-Type": "application/json"}
		});
	}
	catch(error) {console.log("failed to add");}
	Subs.value = "";
	console.log("New Center created", newCenterObject);
	await renderCenters();
	hidebutton();
});


/*
function toggleCentersAll(){
	document.getElementById("CenterSubs").classList.remove("HiddenSelect");
	document.getElementById("CenterSubs").classList.add("subsgrid");
	console.log("clicked");
}
*/


function toggleDays(a) {
	console.log(a.value);
	if (a.value == 1) {
		document.getElementById("DiscountDays").classList.remove("HiddenSelect");
		document.getElementById("changinggrid").classList.add("subsgridyep");
		document.getElementById("changinggrid").classList.remove("subsgrid");
	} 
	else {       
		document.getElementById("DiscountDays").classList.add("HiddenSelect");
		document.getElementById("changinggrid").classList.remove("subsgridyep");
		document.getElementById("changinggrid").classList.add("subsgrid");
		//classlist checks if that class exists already to avoid errors
	}
}


//Below for Interactive Map. 
/* Resources: Leafletjs.com provided L.objects and functions I used exclusively within the interactive map, and Openstreetmap.org provided the map layer itself */
const map = L.map("LCCMap").setView([51.5, -0.09], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 19,
	attribution: "&copy; <a href=\"http://www.openstreetmap.org/copyright\">OpenStreetMap</a>"
}).addTo(map);
//Above code taken from leaflet.js quickstart guide: setView ([center coordinates, zoom level])


document.getElementById("AboutMap").addEventListener("click", displayAbout);
function displayAbout(){
	const text = document.getElementById("AboutText");
	const button = document.getElementById("AboutMap");
	button.style.display = "none";
	text.style.display = "block";
}



let needsReload = false;
async function checkServerStatus() {
	try {
		const response = await fetch("/ping");
		if (response.ok){
			if (needsReload){
				location.reload();}}
	} 
	catch (error) {
		alert("Server down, it will reload automatically when server is back up");
		needsReload = true;
		setTimeout(checkServerStatus, 8000);
	}
}


function hidebutton(){
	const button = document.getElementById("DisplayButton");
	button.style.display = "none";
}


document.addEventListener("click", checkServerStatus);
document.addEventListener("DOMContentLoaded", function() {
	renderCenters();
	renderpins();
});

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
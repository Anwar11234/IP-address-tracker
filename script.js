const form = document.querySelector('form');
const ipAddressInput = document.querySelector('.ip-address');

const apiUrl = 'https://geo.ipify.org/api/v1?';
const apiKey = 'at_bh3Db2d8ZjVtqvxPWJrhVpbdOEvMA';

function loadJSON(url){ 
    return fetch(url)
    .then(response => response.json());
}

function makeElement(tag , className , text){ 
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

function generateHTML(ip , region , timezone , isp){ 
    return `
            <div class="result">
            <span class="attribute">Ip address</span>
            <p class="value">${ip}</p>
            </div>
            <div class="result">
            <span class="attribute">location</span>
            <p class="value">${region}</p>
            </div>
            <div class="result">
            <span class="attribute">timezone</span>
            <p class="value">UTC-${timezone}</p>
            </div><div class="result">
            <span class="attribute">isp</span>
            <p class="value">${isp}</p>
            </div>
    `
}


function displayData(json){ 
    const results = document.querySelector('.results');
    const data =  generateHTML(json.ip , json.location.region , json.location.timezone , json.isp); 
    results.innerHTML = data;
}


form.addEventListener('submit' , async (event) => { 
    event.preventDefault();
    if(ipAddressInput.value){ 
        const apiRequestUrl = `${apiUrl}apiKey=${apiKey}&ipAddress=${ipAddressInput.value}`;
        form.reset();
        const resultingData = await loadJSON(apiRequestUrl);
        displayMap(resultingData);
        displayData(resultingData);
    }
});

const mapContainer = document.querySelector('.map-container');

function setMap(lat , long){ 
    let map = L.map('map').setView([lat , long], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW53YXIxMDAiLCJhIjoiY2tyNnZ2a3VzMzIxdzJwbngxeGx6Z2dxNiJ9.sNCxe6-I0O5zL6ByuXMIYQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYW53YXIxMDAiLCJhIjoiY2tyNnZ2a3VzMzIxdzJwbngxeGx6Z2dxNiJ9.sNCxe6-I0O5zL6ByuXMIYQ'
    }).addTo(map);
}

function displayMap(json){ 
    mapContainer.innerHTML = '<div id="map"></div>'
    setMap(json.location.lat , json.location.lng);
}
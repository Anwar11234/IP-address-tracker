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

function makeParentDiv(){ 
    const div = makeElement('div' , 'results');
    document.body.querySelector('.main').append(div);
    renderData(div);
}

function renderData(parent){ 
    const attributes = ['Ip address' , 'location' , 'timezone' , 'isp'];
    for(let i = 0; i < 4; i++){ 
        const result = makeElement('div' , 'result');
        parent.append(result);
        result.append(makeElement('span' , 'attribute' , attributes[i]) , makeElement('p' , 'value'));
    }
}

function displayData(json){ 
    const datatobeDisplayed = [json.ip , json.location.region , `UTC${json.location.timezone}` , json.isp];
    const placesToPutData = document.querySelectorAll('.value');
    placesToPutData.forEach((p , index) => { 
        p.textContent = datatobeDisplayed[index];
    })
}


form.addEventListener('submit' , async (event) => { 
    event.preventDefault();
    if(ipAddressInput.value){ 
        const apiRequestUrl = `${apiUrl}apiKey=${apiKey}&ipAddress=${ipAddressInput.value}`;
        ipAddressInput.value = '';
        const resultingData = await loadJSON(apiRequestUrl);
        setMap(resultingData);
        makeParentDiv();
        displayData(resultingData);
    }
});

function setMap(json){ 
    let map = L.map('map').setView([json.location.lat , json.location.lng], 13);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW53YXIxMDAiLCJhIjoiY2tyNnZ2a3VzMzIxdzJwbngxeGx6Z2dxNiJ9.sNCxe6-I0O5zL6ByuXMIYQ', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1IjoiYW53YXIxMDAiLCJhIjoiY2tyNnZ2a3VzMzIxdzJwbngxeGx6Z2dxNiJ9.sNCxe6-I0O5zL6ByuXMIYQ'
    }).addTo(map);
}
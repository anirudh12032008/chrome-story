

const start = document.getElementById('start');
const stop = document.getElementById('stop');
const board = document.getElementById('board');
const exportbtn = document.getElementById('export');

// i need to remove this in end
// function screenshot(){
//     return "https://placehold.co/600x400?text=testing_123ss"
// }

// the most fucking part :(
async function capture() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab){
        return null;
    }
    // photo time hehe
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function (url) {
        if (chrome.runtime.lastError || !url) {
            console.error(chrome.runtime.lastError);
            return null;
        }
        const title = tab.title || 'Screenshot';
        const time = Date.now();
        addcard(url, title, tab.url, time);
        save(url, title, tab.url, time);
        console.log("proof taken hahaha");
    });
}


// so idk how to save this thing in DB or smth so i'll just save it in local storage for now
function save(img, title, url, time){
    chrome.storage.local.get({ cards: [] }, function (r) {
        const c = r.cards;
        c.push({ img: img, title: title, url: url, time: time });
        chrome.storage.local.set({ cards: c }, function () {
            console.log('your history sent to your mom :hahahahahahahah:', title);
        });
    });
}

function load(){
    chrome.storage.local.get({ cards: [] }, function (r) {
        const c = r.cards;
        c.forEach(card => {
            addcard(card.img, card.title, card.url, card.time);
        }
    );
    });
}
load();

let count = 0

function addcard(img, title, url, time) {
    count++;
    const x = document.createElement('div');
    // x.className = "flex flex-col items-center bg-gray-700 text-white p-3 my-4 rounded-xl sm:flex-row shadow-xl hover:scale-107 transform transition-all duration-500 w-full";
    x.className = "flex flex-col items-center bg-gray-700 text-white p-3 my-4 rounded-xl  shadow-xl hover:scale-107 transform transition-all duration-500 w-full";
    const image = document.createElement('img');
    image.src = img;
    image.className = "w-full h-auto object-contain rounded-t-xl shadow-xl";
    image.style.maxHeight = "300px";
   
    // i was making a mistake here so I am just making a new div for everything
    // const dets = document.createElement('div');
    // dets.className ="w-full mt-2 p-2 text-left";

    // const no = document.createElement('div');
    // no.className = "text-sm text-gray-300";
    // no.textContent = `#${count} - ${new Date(time).toLocaleString()}`;

    const dets = document.createElement('div');
    dets.className = "flex flex-col justify-between w-full px-5 items-start p-2 space-y-1";

    const no = document.createElement('div');
    no.className = "text-sm text-gray-300";
    no.textContent = `#${count}`;
const t = document.createElement('div');
t.className = "font-semibold";
    t.innerText = title;
    const u = document.createElement('a');
    u.className = "text-blue-400 text-sm truncate";
    u.href = url;
    u.target = "_blank";
    // this was causing issues due to google search having too big urls
    // u.innerText = url;
    try {
        const p = new URL(url);
        u.innerText = p.hostname;
    } catch (e) {
    //  :prayge: hope this never happens 
        u.innerText = url;
    }
    const ti = document.createElement('div');
    ti.className = "text-xs text-gray-400";
    ti.innerText = new Date(time).toLocaleString();
    dets.appendChild(no);
    dets.appendChild(t);
    dets.appendChild(u);
    dets.appendChild(ti);
    x.appendChild(image);
    x.appendChild(dets);
    board.appendChild(x);
}

start.addEventListener('click', async () => {
    // const img = screenshot();
    // addcard(img, "This is a test title");
    capture();
    console.log("start clicked");
});

stop.addEventListener('click', async () => {
    console.log("stop clicked");
});

exportbtn.addEventListener('click', async () => {
    console.log("export clicked");
});
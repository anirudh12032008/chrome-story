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
        addcard(url, title);
        save(url, title);
        console.log("proof taken hahaha");
    });
}


// so idk how to save this thing in DB or smth so i'll just save it in local storage for now
function save(img, title){
    chrome.storage.local.get({ cards: [] }, function (r) {
        const c = r.cards;
        c.push({ img: img, title: title, timestamp: Date.now() });
        chrome.storage.local.set({ cards: c }, function () {
            console.log('your history sent to your mom :hahahahahahahah:', title);
        });
    });
}

function load(){
    chrome.storage.local.get({ cards: [] }, function (r) {
        const c = r.cards;
        c.forEach(card => {
            addcard(card.img, card.title);
        }
        );
    });
}
load();

function addcard(img, title) {
    const x = document.createElement('div');
    x.className = "flex flex-col items-center bg-gray-700 text-white p-3 my-2 rounded-xl shadow-xl hover:scale-107 transform transition-all duration-500";
    const image = document.createElement('img');
    image.src = img;
    image.className = "w-auto h-auto object-cover rounded-xl shadow-xl";
    const text = document.createElement('div');
    text.className = "text-white text-lg font-semibold mt-2 ";
    text.innerText = title;

    x.appendChild(image);
    x.appendChild(text);
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
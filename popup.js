const start = document.getElementById('start');
const stop = document.getElementById('stop');
const board = document.getElementById('board');
const exportbtn = document.getElementById('export');

function screenshot(){
    return "https://placehold.co/600x400?text=testing_123ss"
}

function addcard(img, title) {
    const x = document.createElement('div');
    const image = document.createElement('img');
    image.src = img;
    image.className = "w-48 h-32 object-cover rounded-lg shadow-lg";
    const text = document.createElement('div');
    text.className = "text-white text-lg font-semibold mt-2";
    text.innerText = title;

    x.appendChild(image);
    x.appendChild(text);
    board.appendChild(x);
}

start.addEventListener('click', async () => {
    const img = screenshot();
    addcard(img, "This is a test title");
});

stop.addEventListener('click', async () => {
    console.log("stop clicked");
});

exportbtn.addEventListener('click', async () => {
    console.log("export clicked");
});
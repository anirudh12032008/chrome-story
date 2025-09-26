

const start = document.getElementById('start');
// const stop = document.getElementById('stop');
const board = document.getElementById('board');
const exportbtn = document.getElementById('export');
const auto = document.getElementById('auto');
const autostart = document.getElementById('autostart');
const autostop = document.getElementById('autostop');

let automode = false;
let autorunning = false;

// auto mode stuff
// chrome.runtime.onMessage.addListener((msg, s, sr) => {
// if (msg.type === 'toggle'){
//     automode = !automode;
//     sr({ automode });
// }


// i need to remove this in end
// function screenshot(){
//     return "https://placehold.co/600x400?text=testing_123ss"
// }

// the most fucking part :(
async function capture() {
    const drop = document.getElementById('ch');
    const ch = drop.value;
    if (!ch) {
        toast("Dumb! select a chapter first", "error");
        return null;
    }
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab){
        return null;
    }
    // photo time hehe
    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function (url) {
        if (chrome.runtime.lastError || !url) {
            console.log(chrome.runtime.lastError);
            toast(chrome.runtime.lastError, "error");
            return null;
        }
        const title = tab.title || 'no title';
        const time = Date.now();
        addcard(url, title, tab.url, time, ch);
        save(url, title, tab.url, time, ch);
        load(ch);
        console.log("proof taken hahaha");
        toast("proof taken and sent to your mom, hahaha", "success");
    });
}

function chapter(title){
    const id = Date.now().toString();
    chrome.storage.local.get({ chapters: [] }, function (r) {
        r.chapters.push({ id: id, title: title, time: Date.now(), cards: [] });
        chrome.storage.local.set({ chapters: r.chapters }, function () {
            loadC();
        });
    }   );
}

function loadC(){
    const drop = document.getElementById('ch');
    const list = document.getElementById('list');
    list.innerHTML = '';
    drop.innerHTML = '';
    chrome.storage.local.get({ chapters: [] }, function (r) {
        r.chapters.forEach(ch => {
            const o = document.createElement('option');
            o.value = ch.id;
            o.innerText = ch.title;
            drop.appendChild(o);

            const d = document.createElement('div');
            d.className = "flex items-center bg-slate-700 p-2 rounded-xl";
            const t = document.createElement('div');
            t.className = "font-semibold text-white ";
            t.innerText = ch.title;

            const action = document.createElement('div');

            const edit = document.createElement('button');
            edit.className = "p-2 bg-yellow-600 rounded-xl shadow-xl hover:bg-blue-800 mx-2  text-black";
            edit.innerText = "Edit";
            edit.onclick = () => editCh(ch.id);
            const del = document.createElement('button');
            del.className = "p-2 bg-red-600 rounded-xl shadow-xl hover:bg-blue-800 mx-2 text-white";
            del.innerText = "Delete";
            del.onclick = () => delCh(ch.id);
            action.appendChild(edit);
            action.appendChild(del);
            d.appendChild(t);
            d.appendChild(action);
            list.appendChild(d);
        });
    });
}


// so idk how to save this thing in DB or smth so i'll just save it in local storage for now
function save(img, title, url, time, ch){
    // chrome.storage.local.get({ cards: [] }, function (r) {
    //     const c = r.cards;
    //     c.push({ img: img, title: title, url: url, time: time });
    //     chrome.storage.local.set({ cards: c }, function () {
    //         console.log('your history sent to your mom :hahahahahahahah:', title);
    //     });
    // });
    chrome.storage.local.get({ chapters: [] }, function (r) {
        const chapters = r.chapters;
        const chapter = chapters.find(c => c.id === ch);
        if (chapter) {
            chapter.cards.push({ img: img, title: title, url: url, time: time });
            chrome.storage.local.set({ chapters: chapters }, function () {
                console.log(`your ${title} history sent to your mom :hahahahahahahah: now cry`, title);
                toast(`your ${title} history sent to your mom :hahahahahahahah: now cry`, "success");
            });
        } else {
            toast("Dumb! i didn't find this chapter", "error");
        }
    }  );
}

function load(id){
    // chrome.storage.local.get({ cards: [] }, function (r) {
    //     const c = r.cards;
    //     c.forEach(card => {
    //         addcard(card.img, card.title, card.url, card.time);
    //     }
    // );
    // });
    board.innerHTML = '';
    chrome.storage.local.get({ chapters: [] }, function (r) {
        const chapters = r.chapters;
        if (!chapters || chapters.length === 0) {
            toast("bruuuhhhh! create a chapter first", "warning");
            return;
        }
        const ch = chapters.find(c => c.id === id);
        if (!ch) {
            toast("Dumb! i didn't find this chapter", "error");
            return;
        }
        count = 0
        ch.cards.forEach(card => {
            addcard(card.img, card.title, card.url, card.time);
        }
        );

    }
    );
}


function editCh(id){
    const newt = prompt("damn! why you changing soo much stuff! ahhh, write the new name then: ");
    if (!newt) {
        toast("Dumb! no name entered you thought I didn't had the error handling, hahaha", "error");

        return;
    }
    chrome.storage.local.get({chapters: []}, function(r){
        const chs = r.chapters
        const ch = chs.find(c => c.id == id);
        if (ch){
            ch.title = newt;
            chrome.storage.local.set({ chapters: chs }, function () {
                loadC();
                toast("Chapter Edited :thumbsup:", "success")
                const curr = document.getElementById('ch').value;
                if (curr === id){
                    load(curr);
                }
        }
        );
        }

    })
}

function delCh(id){
    if (!confirm("broo this is not a joke!!? this would be sent in a blackhole are you sure")) return;
    chrome.storage.local.get({chapters: []}, function(r){
        let chs = r.chapters.filter(c => c.id != id);
        chrome.storage.local.set({chapters:chs}, function(){
            loadC();
            toast("Chapter sent into blackhole :( ", "success")
            const d = document.getElementById('ch').value;
            if (chs.length > 0){
                d.value = chs[0].id;
            load(d.value) 
        chrome.storage.local.set({ cc: d.value });
            } else{
                document.getElementById('board').innerHTML = '';
                d.innerHTML = '';
                chrome.storage.local.remove('cc');

            }
        });

    }   );

}

// before chapter added code ---> <----
// load();

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

    const del = document.createElement('button');
    del.className = "p-2 px-3 bg-red-600 rounded-full shadow-xl hover:bg-red-800 text-white";
    del.innerText= "X";
    del.onclick = () => delC(time)
    

    const d2 = document.createElement('div');
    d2.className = "flex justify-between w-full items-center";

    d2.appendChild(no);
    d2.appendChild(del);
    dets.appendChild(d2);
    dets.appendChild(t);
    dets.appendChild(u);
    dets.appendChild(ti);
    x.appendChild(image);
    x.appendChild(dets);
    board.appendChild(x);
    // loadC();
}


function delC(id){
    if (!confirm("broo this is not a joke!!? this would be sent in a blackhole are you sure")) return;
    const c = document.getElementById('ch').value;
    chrome.storage.local.get({chapters: []}, function(r){
        const chs = r.chapters;
        const ch = chs.find(x => x.id == c);
        if (ch){
            ch.cards = ch.cards.filter(card => card.time != id);
            chrome.storage.local.set({chapters: chs}, function(){
                toast("Card sent to blackhole :(", "success");
            })
        }
    })
}

start.addEventListener('click', async () => {
    // const img = screenshot();
    // addcard(img, "This is a test title");
    // capture();
        const i = document.getElementById('ch').value;
        if (!i) {
            toast("bruhh no chapter selected :angry:", "error");
            return;
        }

        chrome.runtime.sendMessage({ type: 'manual', id: i });
    console.log("start clicked");
    // toast("start clicked", "info");
            toast("proof taken and sent to your mom, hahaha", "success");

});


function exportCh(){
    chrome.storage.local.get({chapters: [], cc: null}, function(r){
        const chs = r.chapters;
        const cc = r.cc;
        if (!cc){
            toast("Dumb! select a chapter first", "error");
            return;
        }
const ch = chs.find(c => c.id == cc)
if (!ch){
    toast("IDK wtf you did find the err yourself, hahah", "error")
    return;
}
const inp = confirm("Export as? JSON = OK, PDF(note it will be in HTML format) = Cancel  (sorry I am lazy to make a proper UI for this)");
if (inp){

    const j = JSON.stringify(ch, null, 2);
    const b = new Blob([j], {type: 'application/json'});
    const url = URL.createObjectURL(b);
    const a = document.createElement('a')
    a.href = url;
    try {

    a.download = `${ch.title}-export.json`
    } catch(e){
        toast("your title has something wierd in it I am not adding a regex just rename it manually", "warning");
        return
}
document.body.appendChild(a);
a.click();
a.remove();
URL.revokeObjectURL(url)
toast("EXPORTED JSON YAYAYY :D", "success")

        }
        else{
            // making pdf style html for now
        //     let cont = `<h1> ${ch.title} </h1>`
        //     if (ch.cards && ch.cards.length){
        //         ch.cards.forEach((c, i)=>{
        //             cont += `<div style="margin: 20px 5px; padding: 10px;">
        //             <h3> ${i+1} --- ${c.title} </h3>
        //             <a href="${c.url}" target="_blank" > URL </a>
        //             <br/>
        //             <img src="${c.img}" style="max-width: 400px; max-height: 250px;"/>
        //             <br/>
        //             <small> time -- ${new Date(c.time).toLocaleString()} </small>
        //             </div>
        //             <hr/>
        //             `
        //         })
        //     }
        //     else{
        //         cont += "<h3> NO CARDS </h3>"
        //     }
        //     const b = new Blob([cont], {type: 'text/html'});
        //     const url = URL.createObjectURL(b);
        //     const a = document.createElement('a')
        //     a.href = url;
        //     a.download = `${ch.title}-export.pdf.html`
        //     document.body.appendChild(a);
        //     a.click()
        //     a.remove()
        // URL.revokeObjectURL(url)
        // toast("EXPORTED PDF YAYAYY :D", "success")



        // trying jspdf :/
        // PS- WORKING :D
        const {jsPDF} = window.jspdf;
        const doc = new jsPDF();
// doc.text("Hello world!", 10, 10);
// doc.save("a4.pdf");
doc.setFontSize(22);
doc.text(ch.title, 10,20);
let y =31
if (ch.cards && ch.cards.length){
    ch.cards.forEach((c, i)=>{
        doc.setFontSize(16);
        doc.text(`${i+1} --- ${c.title}`, 10, y)
        y += 6
        doc.setFontSize(10);
        doc.text(`URL --- ${c.url}`, 10, y)
        y+= 6 
        doc.addImage(c.img, 'PNG', 10, y, 180, 100);   
        y += 117 
        if (y >270){
            doc.addPage();
            y = 10
        }

    })
} else {
    doc.text("bruh you have nothing :((((", 10, y)
}
doc.save(`${ch.title}-export.pdf`);
toast("EXPORTED PDF YAYAYY :D", "success")
        }
});
}

// stop.addEventListener('click', async () => {
//     console.log("stop clicked");
// });

exportbtn.addEventListener('click', async () => {
    console.log("export clicked");
    // this is tuff :sadge:
    toast("export clicked", "info");
    exportCh();
});

document.getElementById('ch').addEventListener('change', (e) => {
    const i = e.target.value
    load(i);
    console.log(i);
    chrome.storage.local.set({ cc: i });

});

document.getElementById('add').addEventListener('click', () => {
    const inp = document.getElementById('name');
    const name = inp.value.trim();
    if (name){
        const id = Date.now().toString(); 
        chrome.storage.local.get({ chapters: [] }, function (r) {
            r.chapters.push({ id: id, title: name, time: Date.now(), cards: [] });
            chrome.storage.local.set({ chapters: r.chapters }, function () {
                loadC();
                inp.value = '';
                chrome.storage.local.set({ cc: id }); 
                toast("CHAPTER ADDED :yayaya:", "success");
            });
        });
    } else{
        toast("Dumb! enter a chapter name", "error");
    }
});
loadC();

auto.addEventListener('click', async () => {
    automode = !automode;
    auto.innerText = automode ? "Turn OFF auto mode" : "Turn ON auto mode";
    console.log(automode);
    chrome.storage.local.set({ automode });  
    toast( `Automde = ${automode}`, "success");
});

autostart.addEventListener('click', async () => {
    if(!automode){
        toast("Dumb! turn on the auto mode first", "warning");
        return;
    }
    toast("Starting the auto proof taking :D", "info")
    autorunning = true;
    autostart.disabled = true;
    autostop.disabled = false;
    chrome.storage.local.set({ autorunning }); 
    chrome.runtime.sendMessage({ type: 'start' });
});

autostop.addEventListener('click', async () => {
    if(!automode){
        toast("Dumb! turn on the auto mode first" , "warning");
        return;
    }
    toast("Stopping :(", "info");
    autorunning = false;
    autostart.disabled = false;
    autostop.disabled = true;
    chrome.storage.local.set({ autorunning }); 
    chrome.runtime.sendMessage({ type: 'stop' });
});

function change(){
    if (autorunning && automode){
        capture();  
}}


chrome.runtime.onMessage.addListener((msg, s, sr) => {
    if (msg.type === 'capture'){
        capture();
    }
});

// load the first chapter in the list on startup
chrome.storage.local.get({ chapters: [] }, function (r) {
    if (r.chapters && r.chapters.length > 0) {
        const first = r.chapters[0];
        load(first.id);
        document.getElementById('ch').value = first.id;
    } else{
        toast("nothing", "warning");        
    }
    }
    );
chrome.storage.local.get({ automode: false, autorunning: false }, (r) => {
    automode = r.automode;
    autorunning = r.autorunning;
    auto.innerText = automode ? "Turn OFF auto mode" : "Turn ON auto mode";
});


chrome.storage.onChanged.addListener((c, a) => {
    if (a === 'local' && c.chapters) {
        const curr = document.getElementById('ch').value;
        if (curr) load(curr);
    }
});


document.getElementById('manage').addEventListener('click', () => {
    const l = document.getElementById('list');
    l.classList.toggle('hidden');
    toast("Hmmm I don't like manager :/", "info")
});


chrome.storage.local.get({automode: false, autorunning: false}, (r) => {
    automode = r.automode;
    autorunning = r.autorunning;
    auto.innerText = automode ? "Turn OFF auto mode" : "Turn ON auto mode";
    autostart.disabled = autorunning
    autostop.disabled = !autorunning
})

// searched for a good toast function and found this on stackoverflow :D ( still I modified stuff a bit)
function toast(msg, type='info'){
    const c = document.getElementById('toast');
    const color = {
        success: 'bg-green-600',
        error: 'bg-red-600',
    info: 'bg-blue-600',
warning: 'bg-yellow-600'    }
const t = document.createElement('div');
t.className = `f;ex items-center px-4 py-2 text-white rounded-xl shadow-xl ${color[type]}`
t.innerHTML = msg;
c.appendChild(t);

requestAnimationFrame(() => {
    t.classList.remove('opacity-0', "translate-y-3");
    // toast.classList.add('opacity-100', "translate-y-0");
})
setTimeout(() => {
    t.classList.add('opacity-0', "translate-y-3");
    setTimeout(() => {
        c.removeChild(t)
    }, 500);
}, 6000);
}


// document.getElementById('export').addEventListener('click', () => {
//     toast("Export clicked", "info");
// });
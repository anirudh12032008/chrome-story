let run = false;

console.log("Background loaded");

const last = {};

chrome.runtime.onMessage.addListener((msg, s, sr) => {
        console.log("Message received:", msg);

    if (msg.type === 'start'){
        run = true;
        chrome.tabs.onActivated.addListener(change);
        chrome.tabs.onUpdated.addListener(tabup);
    }

    if (msg.type === 'stop'){
        run = false;
        chrome.tabs.onActivated.removeListener(change);
        chrome.tabs.onUpdated.removeListener(tabup);
    }
     if (msg.type === 'manual') {
        capture(msg.id);
    }
});

function change(id, info, tab) {
    if (!run) return;

    // get the selected chapter from storage
    chrome.storage.local.get(['cc'], (res) => {
        if (!res.cc) {
                        console.log("idgaf bro has no chapter");

        } 
        // const now = Date.now();
        // if (!last[res.cc] || now - last[res.cc] > 1000) {
        //     last[res.cc] = now;
        //     capture(res.cc);
        // } else {
        //     console.log("fuck reloading", res.cc);
        // }
        capture(res.cc)
    });
}

function tabup(tabId, changeInfo, tab) {
    if (changeInfo.status === 'complete') {
        change(tabId, changeInfo, tab);
    }
}


async function capture(chapterId) {
    if (!chapterId) return;

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) return;

    chrome.tabs.captureVisibleTab(tab.windowId, { format: 'png' }, function (url) {
        if (chrome.runtime.lastError || !url) {
            console.log(chrome.runtime.lastError);
            return;
        }

        const title = tab.title || 'no title';
        const time = Date.now();
        chrome.storage.local.get({ chapters: [] }, function (r) {
            const chapters = r.chapters;
            const chapter = chapters.find(c => c.id === chapterId);
            if (chapter) {
                chapter.cards.push({ img: url, title, url: tab.url, time });
                chrome.storage.local.set({ chapters });
                console.log("Sent to mommmmm, hahahah ", title);
            }
        });
    });
}
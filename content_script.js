const sc = document.createElement("script");
sc.src = browser.runtime.getURL("inject_to_page.js");
document.documentElement.appendChild(sc);

let currentVolume = 100;

function updateElements() {
    for (let elem of document.querySelectorAll("audio, video")) {
        let src = elem.src || elem.currentSrc;
        let paused = elem.paused;
        if (!elem.volumeboosteraudiocontext) {
            let audiocontext = new AudioContext();
            let creategain = audiocontext.createGain();
            let source = audiocontext.createMediaElementSource(elem);
            source.connect(creategain);
            creategain.connect(audiocontext.destination);

            elem.volumeboosteraudiocontext = audiocontext;
            elem.volumeboostercreategain = creategain;
            elem.volumeboostersource = source;
        }
        elem.volumeboostercreategain.gain.value = currentVolume / 100;
        if (src.startsWith("http") && src && elem.volumeboosterignoredcorssrc !== src) {
            elem.volumeboosterignoredcorssrc = src;
            browser.runtime.sendMessage({
                type: "bypass_cors_request",
                data: {
                    url: src
                },
            });
            setTimeout(() => {
                elem.setAttribute("crossorigin", "anonymous");
                elem.src = src + "";
                if (!paused) {
                    elem.play();
                }
            }, 100);
        }
    }
}

const targetNode = document.documentElement;
const config = { attributes: true, childList: true, subtree: true };
const observer = new MutationObserver(updateElements);
observer.observe(targetNode, config);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case "get_current_volume":
            sendResponse(currentVolume);
            break;
        case "set_current_volume":
            currentVolume = request.data.volume;
            updateElements();
            break;
        default:
            break;
    }
});

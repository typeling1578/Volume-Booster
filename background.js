let targets = [];

browser.webRequest.onHeadersReceived.addListener(
    function(e) {
        for (let target of targets) {
            if (target.tabId === e.tabId && target.url === e.url) {
                let targetHeaders = e.responseHeaders.filter(responseHeader => responseHeader.name.toLowerCase() === "access-control-allow-origin");
                if (targetHeaders.length > 0) {
                    if (targetHeaders[0].value === "*") return;
                    targetHeaders[0].value = "*";
                } else {
                    e.responseHeaders.push(
                        {
                            name: "Access-Control-Allow-Origin",
                            value: "*",
                        }
                    )
                }
                console.log(e.responseHeaders);
                return { responseHeaders: e.responseHeaders };
            }
        }
        return;
    },
    { urls: ["<all_urls>"] },
    ["blocking", "responseHeaders"]
);

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
        case "bypass_cors_request":
            targets.push({
                tabId: sender.tab.id,
                url: request.data.url,
            });
            break;
        default:
            break;
    }
});

browser.tabs.onRemoved.addListener(function(tabId) {
    targets = targets.filter(target => target.tabId !== tabId);
});

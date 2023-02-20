(async () => {
    let currentTab = (await browser.tabs.query({ currentWindow: true, active: true }))[0];
    let volumeSlider = document.getElementById("volume_slider");
    let currentVolumeElem = document.getElementById("current_volume");
    volumeSlider.addEventListener("input", function(e) {
        let volume = e.currentTarget.value;
        currentVolumeElem.innerText = volume;
        browser.tabs.sendMessage(
            currentTab.id,
            {
                type: "set_current_volume",
                data: {
                    volume: volume
                }
            }
        );
    });
    let currentVolume = await browser.tabs.sendMessage(
        currentTab.id,
        { type: "get_current_volume" }
    );
    console.log(currentVolume);
    volumeSlider.value = currentVolume;
    currentVolumeElem.innerText = currentVolume;
})();

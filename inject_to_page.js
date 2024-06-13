const audio_play = Audio.prototype.play;
Audio.prototype.play = function() {
    if (!Array.from(document.querySelectorAll("audio")).includes(this)) {
        this.style.display = "none";
        document.body.appendChild(this);
    }
    audio_play.call(this);
}


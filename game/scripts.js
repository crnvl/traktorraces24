const dino = document.getElementById('dino');
const cactus = document.getElementById('cactus');
let score = 0;

function jump() {
    if (dino.classList != 'jump') {
        dino.classList.add('jump');

        setTimeout(function () {
            dino.classList.remove('jump');
        }, 300);
    }
}

let isAlive = setInterval(function () {

    if(cactus.classList != 'run')
        return;

    let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue('top'));
    let cactusLeft = parseInt(window.getComputedStyle(cactus).getPropertyValue('left'));

    if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {

        cactus.classList.remove('run');

        const urlParams = new URL(window.location);

        var xhr = new XMLHttpRequest();
        var url = "https://races.4c3711.xyz/matches/played";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        var data = JSON.stringify({
            "sessionKey": urlParams.searchParams.get("sessionKey"),
            "score": score,
            "matchId": urlParams.searchParams.get("matchId")
        });
        xhr.send(data);

        alert('Game Over! Dein Score wurde erfolgreich an traktorraces24 uebermittelt.');
        window.location.replace("https://4c3711.xyz/game/finished.html");
    }
    score = score + 1;
    console.log(score)
}, 10)

document.addEventListener('keydown', function (event) {
    if(cactus.classList != 'run')
        cactus.classList.add('run');
    jump();
});
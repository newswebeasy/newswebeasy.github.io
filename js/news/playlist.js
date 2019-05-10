'use restrict';

let playing = 0;
let playlist = document.getElementsByClassName('title_link');

const player = document.getElementById('player');
player.load();

let repeat_one = false;
player.onended = function () {
  console.log('end');
  if (repeat_one) {
    player.play();
  } else {
    let next = (playing + 1) % playlist.length;
    console.log(`next: ${next}`);
    play(next);
  }
}
player.onplay = function (e) {
  playlist[playing].parentElement.parentElement.classList.add("playing");
}
player.onpause = function (e) {
  playlist[playing].parentElement.parentElement.classList.remove("playing");
}

function play(i) {
  if (i != playing) {
    var last = playing;
    playing = i;
    player.src = playlist[playing].dataset.voiceUrl;
    player.load();

    if (type(last) !== 'undefined') {
      playlist[last].parentElement.parentElement.classList.remove("playing");
    }
  }

  if (player.paused) {
    player.play();
  }

  return false;
}

if (playlist && playlist.length > 0) {
  player.src = playlist[playing].dataset.voiceUrl;
  player.load();
  player.play();
}
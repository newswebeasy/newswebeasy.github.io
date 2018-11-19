var playing = null;
var playlist = document.getElementsByClassName('title_link');

var player = document.getElementById('player');
player.load();

var repeat_one = false;
player.onended = function () {
  console.log('end');
  if (repeat_one) {
    player.play();
  } else {
    var next = playing.nextElementSibling || playlist[0];
    console.log('next');
    console.log(next);
    play(next);
  }
}
player.onplay = function (e) {
  playing.parent.parent.classList.add("playing");
}
player.onpause = function (e) {
  playing.parent.parent.classList.remove("playing");
}

function play(el) {
  if (el != playing) {
    var last = playing;
    playing = el;
    player.src = playing.dataset.voiceUrl;
    player.load();

    if (last) {
      last.parent.parent.classList.remove("playing");
    }
  }

  if (player.paused) {
    player.play();
  }

  return false;
}

if (playlist && playlist.length > 0) {
  play(playlist[0]);
}
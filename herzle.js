debug = true;

player_pos = [300, 500];
enemy_pos = [300, 0];
pewpew = 0;

document.onkeydown = onKeyDown;

function onKeyDown(e) {
  e = e || window.event;

  if (e.keyCode == '37') { // left
    player_pos[0] -= 10;
  }
  if (e.keyCode == '39') { // right
    player_pos[0] += 10;
  }
  if (e.keyCode == '32') { // space = fire
    shoot(player_pos);
  }
}

shoots = [];
function shoot(pos) {
  shoots[shoots.length] = [pos[0], pos[1]];
  // pewpew = 5;
}

function isCollided(a, b) {
  var a_left   = a.getClientRects()[0].left;
  var a_right  = a.getClientRects()[0].right;
  var a_top    = a.getClientRects()[0].top;
  var a_bottom = a.getClientRects()[0].bottom;

  var b_left   = b.getClientRects()[0].left;
  var b_right  = b.getClientRects()[0].right;
  var b_top    = b.getClientRects()[0].top;
  var b_bottom = b.getClientRects()[0].bottom;

  return !(
    (a_left > b_right) ||
    (a_right < b_left) ||
    (a_top > b_bottom) ||
    (a_bottom < b_top)
  );
}

function detectCollisions() {
  // detect collision
  var enemydiv = document.getElementById("enemy");
  for(var i = 0; i < shoots.length; i++) {
    if (shoots[i]) {
      var shootdiv = document.getElementById('shoot' + i);
      if (shootdiv && isCollided(shootdiv, enemydiv)) {
        pewpew = 5;
      }
    }
  }
}

function render() {
  // render shoots
  for(var i = 0; i < shoots.length; i++) {
    if (shoots[i]) {
      var shootdiv = document.getElementById('shoot' + i);

      if (!shootdiv) {
        shootdiv = document.createElement('div');
        shootdiv.setAttribute('id', 'shoot' + i);
        shootdiv.setAttribute('class', 'shoot');
        shootdiv.innerHTML = 'i';

        var body = document.getElementsByTagName('body')[0];
        body.appendChild(shootdiv);
      }

      shootdiv.style.left = shoots[i][0];
      shootdiv.style.top  = shoots[i][1];
      if (debug)
        shootdiv.style.border = "1px solid";
    } else {
      if (deldiv = document.getElementById('shoot' + i)) {
        var body = document.getElementsByTagName('body')[0];
        body.removeChild(deldiv);
      }
    }
  }

  // render pew pew
  var pewpewdiv = document.getElementById("pewpew");
  if (pewpew > 0) {
    pewpewdiv.innerHTML = "pew! pew!";
  } else {
    pewpewdiv.innerHTML = "";
  }

  // render player
  var playerdiv = document.getElementById("player");
  playerdiv.style.left = player_pos[0];
  // FIXME playerdiv.style.top = player_pos[1];
  if (debug)
    playerdiv.style.border = "1px solid";

  // render enemy
  var enemydiv = document.getElementById("enemy");
  enemydiv.style.left = enemy_pos[0];
  enemydiv.style.top = enemy_pos[1];
  if (debug)
    enemydiv.style.border = "1px solid";
}

function animate() {
  // animate shoots
  for(var i = 0; i < shoots.length; i++) {
    if (shoots[i]) {
      shoots[i][1] -= 20;
      if (shoots[i][1] < 0) {
        delete(shoots[i]);
      }
    }
  }

  // animate pew pew
  if (pewpew > 0) {
    pewpew -= 1;
  }

  // animate enemy
  var min = -50;
  var max = +50;
  var off = min + parseInt(Math.random() * (max-min));
  enemy_pos[0] += off;
  if (enemy_pos[0] < 0) enemy_pos[0] = 0;
  if (enemy_pos[0] > 600) enemy_pos[0] = 600;
}

function gameLoop() {
  detectCollisions();
  render();
  animate();

  setTimeout("gameLoop()", 100);
}

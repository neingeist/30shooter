debug = false;

player_pos = [0.5 * window.innerWidth, 0.9 * window.innerHeight];
enemy_pos  = [0.5 * window.innerWidth, 0.1 * window.innerHeight];
new_enemy_pos = [enemy_pos[0], enemy_pos[1]];
pewpew = 0;
herzles = 0;
lastshoot = 0;

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
    if ((new Date()).getTime() - lastshoot > 300) {
      shoot(player_pos);
    }
  }
}

shoots = [];
function shoot(pos) {
  lastshoot = (new Date()).getTime();
  shoots[shoots.length] = [pos[0], pos[1], false];
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
        if (!shoots[i][2]) {
          herzles++;
          shoots[i][2] = true; // hit once
        }
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

      shootdiv.style.left = (shoots[i][0]
                            - Math.round(shootdiv.getClientRects()[0].width/2)) + 'px';
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

  // herzles
  var herzlesdiv = document.getElementById("herzles");
  if (herzles > 0) {
    herzlesdiv.innerHTML = herzles + " &lt;3";
  }

  // render player
  var playerdiv = document.getElementById("player");
  playerdiv.style.left = (player_pos[0]
                          - Math.round(playerdiv.getClientRects()[0].width/2)) + 'px';
  playerdiv.style.top = (player_pos[1]
                         - Math.round(playerdiv.getClientRects()[0].height/2)) + 'px';
  if (debug)
    playerdiv.style.border = "1px solid";

  // render enemy
  var enemydiv = document.getElementById("enemy");
  enemydiv.style.left = (enemy_pos[0]
                         - Math.round(enemydiv.getClientRects()[0].width/2)) + 'px';
  enemydiv.style.top = (enemy_pos[1]
                        - Math.round(enemydiv.getClientRects()[0].height/2)) + 'px';
  if (debug)
    enemydiv.style.border = "1px solid";
}

function lerp(t, a, b) {
  return (a + t*(b-a));
}

var a = 0;

function animate() {
  // inc loop counter
  a++;

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
  // every now and then change direction
  var min = -50;
  var max = +50;
  if (a % 15 == 0) {
    var off = min + parseInt(Math.random() * (max-min));
    new_enemy_pos[0] += off;
    var off = min + parseInt(Math.random() * (max-min));
    new_enemy_pos[1] += off;
    if (new_enemy_pos[0] < 0) new_enemy_pos[0] = 0;
    if (new_enemy_pos[0] > window.innerWidth) new_enemy_pos[0] = window.innerWidth;
    if (new_enemy_pos[1] < 0.05 * window.innerHeight) new_enemy_pos[1] = 0.05 * window.innerHeight;
    if (new_enemy_pos[1] > 0.5 * window.innerHeight) new_enemy_pos[0] = 0.5 * window.innerHeight;
  }
  // slowly move to desired position
  enemy_pos[0] = lerp(0.15, enemy_pos[0], new_enemy_pos[0]);
  enemy_pos[1] = lerp(0.15, enemy_pos[1], new_enemy_pos[1]);
}

function gameLoop() {
  detectCollisions();
  render();
  animate();

  setTimeout("gameLoop()", 100);
}

function init() {
  gameLoop();
}

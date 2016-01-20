// Enemies our player must avoid
var Enemy = function(x, y, v) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemy's location
    this.model_row_offset = -20;  // pixel offset to align model to tile
    this.x = x*tile_w;
    this.y = y*tile_h + this.model_row_offset;

    // Enemy's velocity (i.e. speed), in pixels per second
    this.v = v;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // v = dx/dt; v = velocity, dx = pixel displacement, dt = delta time in seconds
    // dx = v * dt
    var dx = this.v * dt;
    this.x = this.x + dx;

    // If the enemy goes off screen to the right, loop back to beginning position
    // Also generate a new random row location, and new random velocity
    if (this.x > document.getElementsByTagName('canvas')[0].width) {
        this.x = -tile_w;
        this.y = getRandomIntInclusive(1,3)*tile_h + this.model_row_offset;
        this.v = getRandomIntInclusive(min_v, max_v);
    }
};

// Check if this enemy has collided with player
// If collision, then decrement player life count and return player to starting tile
Enemy.prototype.checkCollision = function() {
    /*
    From the x,y coordinates of this enemy and player, infer their rectangular boundaries.
    The x,y coordinates are the lower-left corner of the enemy/player,
    and the size of the enemy/player is the tile size.
    Enemies/players must be aligned to discrete rows, so just check if the enemy and player
    overlap on the x-axis.
    */
    var collision = false;

    var enemy_row = (this.y - this.model_row_offset)/tile_h;
    var player_row = (player.y - player.model_row_offset)/tile_h;

    if (enemy_row == player_row &&
        this.x <= player.x && player.x <= this.x + tile_w) {
        collision = true;
    }

    if (collision) {
        player_lives--;

        // Move player back to initial location
        player.x = 2*tile_w;
        player.y = 4*tile_h + player.model_row_offset;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Player sprite
    this.sprite = 'images/char-boy.png';

    // Player location
    this.model_row_offset = -10;
    this.x = 2*tile_w;
    this.y = 4*tile_h + this.model_row_offset;
};

Player.prototype.update = function(dt) {
    // I don't need this, it's functionality is cleanly included in handleInput()
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.handleInput = function(key) {
    // Move the player in the intended direction, if possible
    // Make sure the player never moves outside the playing area
    if (key === 'left' && this.x > 0) {
        this.x -= tile_w;
    }
    else if (key === 'up' && this.y - this.model_row_offset > 0) {
        this.y -= tile_h;
    }
    else if (key === 'right' && this.x + tile_w < document.getElementsByTagName('canvas')[0].width) {
        this.x += tile_w;
    }
    else if (key === 'down' && this.y - this.model_row_offset < 5*tile_h) {  // FIXME: Just know there are 6 rows, not flexible code
        this.y += tile_h;
    }

    // If player moves to the water (first row), the player has won
    var player_row = (this.y - this.model_row_offset)/tile_h;
    if (player_row == 0) {
        won = true;
    }
};

// Random integer generation helper function, taken from:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// x y locations will be multiplied by this amount
// to get the enemies and player aligned to tiles
tile_w = 101;
tile_h = 83;

// min/max values for random enemy velocities
min_v = 100;
max_v = 400;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
allEnemies = [
    new Enemy(0, 1, getRandomIntInclusive(min_v, max_v)),
    new Enemy(0, 2, getRandomIntInclusive(min_v, max_v)),
    new Enemy(0, 3, getRandomIntInclusive(min_v, max_v))
];
player = new Player();

// Keep track of game stats
player_lives = 5;
won = false;

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

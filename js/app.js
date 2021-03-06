// Enemies our player must avoid
var Enemy = function(x, y, v) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    // Enemy's location
    this.MODEL_ROW_OFFSET = -20;  // pixel offset to align model to tile
    this.x = x*TILE_W;
    this.y = y*TILE_H + this.MODEL_ROW_OFFSET;

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
        this.x = -TILE_W;
        this.y = getRandomIntInclusive(1,3)*TILE_H + this.MODEL_ROW_OFFSET;
        this.v = getRandomIntInclusive(MIN_V, MAX_V);
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

    var enemyRow = (this.y - this.MODEL_ROW_OFFSET)/TILE_H;
    var playerRow = (player.y - player.MODEL_ROW_OFFSET)/TILE_H;

    if (enemyRow == playerRow &&
        this.x <= player.x && player.x <= this.x + TILE_W) {
        collision = true;
    }

    if (collision) {
        playerLives--;

        // Move player back to initial location
        player.x = 2*TILE_W;
        player.y = 4*TILE_H + player.MODEL_ROW_OFFSET;
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
    this.MODEL_ROW_OFFSET = -10;
    this.x = 2*TILE_W;
    this.y = 4*TILE_H + this.MODEL_ROW_OFFSET;
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
    if (key == 'left' && this.x > 0) {
        this.x -= TILE_W;
    }
    else if (key == 'up' && this.y - this.MODEL_ROW_OFFSET > 0) {
        this.y -= TILE_H;
    }
    else if (key == 'right' && this.x + TILE_W < document.getElementsByTagName('canvas')[0].width) {
        this.x += TILE_W;
    }
    else if (key == 'down' && this.y - this.MODEL_ROW_OFFSET < 5*TILE_H) {  // FIXME: Just know there are 6 rows, not flexible code
        this.y += TILE_H;
    }

    // Calculate column and row coordinates of player and gem
    var playerCol = this.x/TILE_W;
    var playerRow = (this.y - this.MODEL_ROW_OFFSET)/TILE_H;

    var gemCol = (gem.x - gem.MODEL_COL_OFFSET)/TILE_W;
    var gemRow = (gem.y - gem.MODEL_ROW_OFFSET)/TILE_H;

    // If player moves to location of a gem, increase the bonus score, and respawn gem
    if (playerCol == gemCol && playerRow == gemRow) {
        bonus += 50 + 50*gem.val;
        gem.respawn(gem.x, gem.y);
    }

    // If player moves to the water (first row), the player has won
    if (playerRow == 0) {
        won = true;

        // Calculate score
        score = 100*playerLives + bonus;

        // Update personal best score if applicable
        if (score > personalBest) {
            personalBest = score;
        }
    }
};

// Gems the player can collect to get bonus points
var Gem = function() {
    // Gem value
    this.val = getRandomIntInclusive(0,2);

    // Choose appropriate sprite based on gem's value
    if (this.val == 0) {
        this.sprite = 'images/Gem_Blue.png';
    }
    else if (this.val == 1) {
        this.sprite = 'images/Gem_Green.png';
    }
    else {
        this.sprite = 'images/Gem_Orange.png';
    }

    // Gem location
    this.MODEL_ROW_OFFSET = 25;
    this.MODEL_COL_OFFSET = 10;
    this.x = getRandomIntInclusive(0, 4)*TILE_W + this.MODEL_COL_OFFSET;
    this.y = getRandomIntInclusive(1, 3)*TILE_H + this.MODEL_ROW_OFFSET;
};

Gem.prototype.render = function() {
    // Must shrink the original sprite to fit nicely in the tile
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 80, 100);
};

Gem.prototype.respawn = function(oldX, oldY) {
    // Respawn a new gem with random color, and random location
    // Make sure new location is different than old location
    this.val = getRandomIntInclusive(0,2);
    if (this.val == 0) {
        this.sprite = 'images/Gem_Blue.png';
    }
    else if (this.val == 1) {
        this.sprite = 'images/Gem_Green.png';
    }
    else {
        this.sprite = 'images/Gem_Orange.png';
    }

    while (this.x == oldX && this.y == oldY) {
        this.x = getRandomIntInclusive(0, 4)*TILE_W + this.MODEL_COL_OFFSET;
        this.y = getRandomIntInclusive(1, 3)*TILE_H + this.MODEL_ROW_OFFSET;
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
TILE_W = 101;
TILE_H = 83;

// min/max values for random enemy velocities
MIN_V = 100;
MAX_V = 400;

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Place the gem object in a variable called gem
allEnemies = [
    new Enemy(0, 1, getRandomIntInclusive(MIN_V, MAX_V)),
    new Enemy(0, 2, getRandomIntInclusive(MIN_V, MAX_V)),
    new Enemy(0, 3, getRandomIntInclusive(MIN_V, MAX_V))
];
player = new Player();
gem = new Gem();

// Keep track of game stats
playerLives = 5;
won = false;
bonus = 0;
score = 0;
personalBest = 0;

// This flag allows us to pause the actual game, for menus etc.
gameStart = false;

// Although, we want to render the initial scene first
loadInitialScene = true;

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

    // When user presses Enter (code = 13), we start new game
    // e.g. transitioning from welcome screen, new game after game over, etc.
    if (e.keyCode == 13) {
        // Re-initialize enemies and player, and game stats
        allEnemies = [
            new Enemy(0, 1, getRandomIntInclusive(MIN_V, MAX_V)),
            new Enemy(0, 2, getRandomIntInclusive(MIN_V, MAX_V)),
            new Enemy(0, 3, getRandomIntInclusive(MIN_V, MAX_V))
        ];
        player = new Player();
        playerLives = 5;
        won = false;
        bonus = 0;
        score = 0;

        // Set below flag for other code to use
        gameStart = true;
    }
});

// adding needed variable declarations
const inquirer = require('inquirer');
const Enemy = require('./Enemy');
const Player = require('./Player'); 

function Game() {
    this.roundNumber = 0;
    this.isPlayerTurn = false;
    this.enemies = [];
    this.currentEnemy;
    this.player;
}

// Setting up Enemy and Player objects
Game.prototype.initializeGame = function() {
    // enemies array
    this.enemies.push(new Enemy('goblin', 'sword'));
    this.enemies.push(new Enemy('orc', 'baseball bat'));
    this.enemies.push(new Enemy('skeleton', 'axe'));

    // keep track of which Enemy object is currently fighting the Player
    this.currentEnemy = this.enemies[0];

    // prompt user for name
    inquirer   
        .prompt({
            type: 'text',
            name: 'name',
            message: 'What is your name?'
        })
        // destructure name from the prompt object
        .then(({ name }) => {
            this.player = new Player(name);

            // test the object creation
            this.startNewBattle(this.currentEnemy, this.player);
        });
};

module.exports = Game;
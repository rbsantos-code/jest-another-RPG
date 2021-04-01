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
            console.log(this.currentEnemy, this.player);

            // start battle
            this.startNewBattle();
        });
};

// Start battle section
Game.prototype.startNewBattle = function() {
    if (this.player.agility > this.currentEnemy.agility) {
        this.isPlayerTurn = true;
    } else {
        this.isPlayerTurn = false;
    }

    // Display player stats
    console.log('Your stats are as follows');
    console.table(this.player.getStats());

    // Enemy discription
    console.log(this.currentEnemy.getDescription());

    this.battle();
};

// Battle section
Game.prototype.battle = function() {
    if (this.isPlayerTurn) {
        // player prompts will go here - 10.4.5
        inquirer
            .prompt({
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['Attack', 'Use Potion']
            })
            .then(({ action }) => {
                if (action === 'Use Potion') {
                    // follow-up prompt will go here - 10.4.5
                    if (!this.player.getInventory()) {
                        console.log('You do not have any potions!');
                        return this.checkEndOfBattle();
                    }

                    inquirer    
                        .prompt({
                            type: 'list',
                            message: 'Which potion would you like to use?',
                            name: 'action',
                            choices: this.player.getInventory().map((item, index) => `${index + 1}: ${item.name}`)
                            // choices code added in 10.4.6

                        })
                        .then(({ action }) => {
                            const potionDetails = action.split(': ');

                            this.player.usePotion(potionDetails[0] - 1);
                            console.log(`You used a ${potionDetails[1]} potion`);

                            this.checkEndOfBattle();
                        });
                } else {
                    const damage = this.player.getAttackValue();
                    this.currentEnemy.reduceHealth(damage);

                    console.log(`You attacked the ${this.currentEnemy.name}`);
                    console.log(this.currentEnemy.getHealth());

                    this.checkEndOfBattle();
                }
            });
    } else {
        const damage = this.currentEnemy.getAttackValue();
        this.player.reduceHealth(damage);

        console.log(`You were attacked by the ${this.currentEnemy.name}`);
        console.log(this.player.getHealth());

        this.checkEndOfBattle();
    }
};

// End of Battle Section
Game.prototype.checkEndOfBattle = function() {
    // Verify if both characters are alive and continue 
    if (this.player.isAlive() && this.currentEnemy.isAlive()) {
        // switch the order turn
        this.isPlayerTurn = !this.isPlayerTurn;
        this.battle();
    } 
    else if (this.player.isAlive() && !this.currentEnemy.isAlive()) {
        console.log(`You've defeated the ${this.currentEnemy.name}`);

        this.player.addPotion(this.currentEnemy.potion);
        console.log(`${this.player.name} found a ${this.currentEnemy.potion.name} potion`);

        this.roundNumber++;

        if (this.roundNumber < this.enemies.length) {
            this.currentEnemy = this.enemies[this.roundNumber];
            this.startNewBattle();
        } else {
            console.log('You win!');
        } 
    }
    else {
        console.log("You've been deafeated!");
    }
};

module.exports = Game;
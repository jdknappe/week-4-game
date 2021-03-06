$(document).ready(function() {

    // VARIABLE DECLARATION
    // =========================================================================================================
    
    // Creating an object to hold the characters.
    var characters = { 
        "Fry": {
            name : "Fry",
            health : 100,
            attack : 8,
            imageUrl : "assets/images/fryguy.jpeg",
            enemyAttackBack: 30
    },
        "Kiff": {
            name : "Kiff",
            health : 70,
            attack : 5,
            imageUrl : "assets/images/kiff.jpeg",
            enemyAttackBack: 15

    },
        "Leila": {
            name : "Leila",
            health : 150,
            attack : 15,
            imageUrl : "assets/images/leila.jpeg",
            enemyAttackBack: 20

    },
        "Zoidberg": {
            name : "Zoidberg",
            health : 180,
            attack : 7,
            imageUrl : "assets/images/zoidberg.jpeg",
            enemyAttackBack: 10
    },
        "Bender": {
            name : "Bender",
            health : 200,
            attack : 17,
            imageUrl : "assets/images/bender.jpeg",
            enemyAttackBack: 30
    },
        "Amy": {
            name : "Amy",
            health : 100,
            attack : 5,
            imageUrl : "assets/images/amy.jpeg",
            enemyAttackBack: 15
        }   
    };

    // Will be populated when the player selects the character.
    var currSelectedCharacter;
    // Populated with all the characters the player did not select.
    var combatants = [];
    // Will be populated once the character chooses an opponent.
    var currDefender;
    // Will keep track of turns during combat
    var turnCounter = 1;
    // Tracks number of defeated opponents.
    var killCount = 0;


    // FUNCTIONS
    // ==========================================================================================================

    // Function renders a character card to the page.
    // The character rendered and the area they are rendered to.
    var renderOne = function (character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        // If the character is an enemy or defender(the active opponent),
        // add the appropriate class.
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        }
        else if (charStatus === "defender") {
            // Populate currDefender with the selected opponent's information.
            currDefender = character;
            $(charDiv).addClass("target-enemy")
        }
    };

    // Function to handle rendering game messages.
    var renderMessage = function (message) {
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        // If we get this specific message passed in, clear the message area.
        if (message === "clearMessage") {
            gameMessageSet.text("");
        }
    };

    // This function handles the rendering of characters based on which on which 
    // area they are chosen to be displayed in.
    var renderCharacters = function (charObj, areaRender) {

        // "characters-section" is the div where all of our characters begin the game.
        // If true, render all characters to the starting area.
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            // Loop through the characters object and call the renderOne function on 
            // each character.
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }
        // "selected character" is the div where our selected character is displayed.
        // If true, render the selected player character to this area.
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender, "");
        }

        // "available-to-attack" is the div where our unchosen opponents are moved to.
        // If true, render the selected character to this area.
        if (areaRender === "#available-to-attack-section") {

            // Loop through the combatants array and call the renderOne function to
            // each character.
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }

            // Creates an on click event for each evemy.
            $(document).on("click", ".enemy", function () {
                var name = ($(this).attr("data-name"));

                // If there is no defender, the clicked enemy will become the defender.
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }
        // "defender" is the div where the active opponent appears.
        // If true, render the selected enemy in this location.
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }

        // Re-render defender when attacked.
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");
        }

        // Re-render player character when attacked.
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selectedCharacter", "")
        }

        // Remove defeated enemy
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
            renderMessage(gameStateMessage);
        }
    };

    // Function which handles restarting the game after victory defeat.
    var restartGame = function (inputEndGame) {

        // When the 'Restart' button is clicked, reload the page.
        var restart = $("<button>Restart</button>").click(function() {
            location.reload();
        })

        // Build a div that will display the victory/defeat message.
        var gameState = $("<div>").text(inputEndGame);

        // Render the restart button and victory/defeat message to the page.
        $("body").append(gameState);
        $("body").append(restart);
    };

    // Renders all the characters to the page when the game starts.
    renderCharacters(characters, "#characters-section");

    // On click event for selecting our character.
    $(document).on("click", ".character", function() {
        // Saving the clicked character's name.
        var name = $(this).attr("data-name");
        console.log(name);
        // If a character has not yet been chosen...
        if (!currSelectedCharacter) {
            // We populate the currSelectedCharacter with the selected character's information.
            currSelectedCharacter = characters[name];
            // Loop throught the remaining characters and push them to the combatants div.
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key])
                }
            }
            console.log(combatants);
            // Hide the character select div.
            $("#characters-section").hide();
            
            // Then redner our selected character and combatants.
            renderCharacters(currSelectedCharacter, "#selected-character")
            renderCharacters(combatants, "#available-to-attack-section");
        }   
    });

    // When the attack is clicked, the following game logic executes…
    $("#attack-button").on("click", function () {
        console.log($("#attack-button"));
        
        if ($("#defender").children().length !==0) {

            // Creates messages for our attack and our opponent's counter-attack.
            var attackMessage = "You attack " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage("clearMessage");

            // Reduce defender's health yb your attack value.
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);
            
            // If the enemy still stands…
            if (currDefender.health > 0) {
                
                // Render the enemy's updated character card.
                renderCharacters(currDefender, "playerDamage");

                // Render the combat messages.
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                // Reduce your helath by the opponent's attack value.
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                // Render the player's updated character card.
                renderCharacters(currSelectedCharacter, "enemyDamage");

                if (currSelectedCharacter.health <=0) {
                    renderMessage("clearMessage");
                    restartGame("You have been defeated!! . . . GAME OVER!!!");
                    $("attack-button").unbind("click");
                }
            }
        }
        // If the enemy has less than zero health, they are defeated.
        // We call the restartGame function to allow the user to restart the game.
        else {
            // Remove your opponent's character card.
            renderCharacters(currDefender, "enemyDefeated");
            // Increment the kill count.
            killCount++;
            // If you have defeated all of your opponents, you win.
            // Call the restartGame function to allow user to restart the game.
            if (killCount >= 5) {
                renderMessage("clearMessage");
                restartGame("You are VICTORIOUS!! Game Over!!!"); 
            }
        }
        turnCounter++;
    });
});
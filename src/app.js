'use strict';

const config = require('./config');
const database = require('./database');

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { MySQL } = require('jovo-db-mysql');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new MySQL(config.db.MySQL.users)
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async NEW_SESSION() {
        this.$speech
            .addText('Welcome to dice rolling championship!')
            .addText('Let\'s see how high you can score by rolling ten dice.');

        this.$user.$data.foo = 'bar';

        return this.toIntent('_rollDice');
    },

    async YesIntent() {
        this.$speech.addText('Awesome!');

        return this.toIntent('_rollDice');
    },

    async END() {
        this.$speech.addText('Thanks for playing. Bye!');

        return this.tell(
            this.$speech
        );
    },

    async _rollDice() {
        this.$speech
            .addText('Here we go!');
        
        let sumOfDice = 0;
        const numberOfDice = 10;
        for (let i = 0; i < numberOfDice; i++ ){
            sumOfDice += Math.ceil(
                Math.random() * 6
            );
        }
        this.$data.sumOfDice = sumOfDice;

        return this.toIntent('_compareResult');
    },

    async _compareResult() {

        const sumOfDice = this.$data.sumOfDice;
        const numberOfBetterScores = await database.getNumberOfBetterScores(sumOfDice);
        console.log(`Number of better scores: ${numberOfBetterScores} (${typeof numberOfBetterScores})`);

        // This doesn't need to be asynchronous, let's reduce latency here :)
        database.writeScore(sumOfDice);

        this.$speech.addText(`Your score is `);

        if (numberOfBetterScores > 0) {
            this.$speech
                .addText("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_negative_01'/>")
                .addText(` ${sumOfDice} points!`)
                .addText(` That's one of the best ${numberOfBetterScores + 1} scores so far.`);
        } else {
            this.$speech
                .addText("<audio src='soundbank://soundlibrary/ui/gameshow/amzn_ui_sfx_gameshow_tally_positive_01'/>")
                .addText(` ${sumOfDice} points!`)
                .addText(` Congrats, that's the best score so far!`);
        }

        return this.toIntent('_prompt');
    },

    async _prompt() {

        const prompt = 'Do you want to try again?';

        return this.ask(
            this.$speech.addText(prompt),
            this.$reprompt.addText(prompt)
        );
    }
});

module.exports.app = app;

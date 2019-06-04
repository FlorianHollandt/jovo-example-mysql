'use strict';

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
    new MySQL()
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    async NEW_SESSION() {
        this.$speech
            .addText('Welcome to dice rolling championship!')
            .addText('Let\'s see how high you can score by rolling ten dice.');

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

        const pool = database.createPool();
        console.time('Retrieving number of better scores: ');
        let numberOfBetterScores = 0;
        try {
            numberOfBetterScores = await database.getNumberOfBetterScores(sumOfDice, pool);
        } catch (error) {
            console.error(`Error at retrieving scores from database: ${JSON.stringify(error, null, 4)}`);
        }
        console.timeEnd('Retrieving number of better scores: ');
        console.log(`Number of better scores: ${numberOfBetterScores}`);

        console.time('Inserting current score: ');
        await database.writeScore(sumOfDice, pool);
        try {
            await database.writeScore(sumOfDice, pool);
        } catch (error) {
            console.error(`Error at writing score to database: ${JSON.stringify(error, null, 4)}`);
        }
        console.timeEnd('Inserting current score: ');
        pool.end();

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

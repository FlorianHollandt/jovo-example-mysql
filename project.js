// ------------------------------------------------------------------
// JOVO PROJECT CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
	alexaSkill: {
		nlu: {
			name: 'alexa',
		},
		manifest: {
			publishingInformation: {
			   locales: {
				  'en-US': {
					 name: 'Dice Championship',
					 summary: "Demo Skill for a simple highscore",
					 description: "Demo Skill for a simple highscore",
					 examplePhrases: [
						 "Alexa open dice championship"
					 ]
				  }
			   },
			},
		 },
		 languageModel: {
			 'en-US': {
				 invocation: 'dynamic entities',
			 },
		 },
   },
   googleAction: {
      nlu:  'dialogflow',
  },
	endpoint: '${JOVO_WEBHOOK_URL}',
 };
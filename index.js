'use strict';
const Alexa = require('alexa-sdk');

const APP_ID = "amzn1.ask.skill.ed110c90-9b28-4c38-9893-4abc77f702dd";
const SKILL_NAME = 'policy assistant';
const HELP_MESSAGE = 'You can ask a question like, what is my claim status.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const handlers = {
    'LaunchRequest': function () {
        var speechText = "";
        speechText += "Welcome to " + SKILL_NAME + ". ";
        speechText += "You can ask a question like, what is my claim status.";
        this.emit(':ask', speechText, HELP_MESSAGE);
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(STOP_MESSAGE);
        this.emit(':responseReady');
    },
    "GetClaimStatusIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            getClaimStatus(claimId, function (res) {
                speechOutput = res;
            });
        } else {
            speechOutput = "Please provide the claim number.";
        }
        this.response.speak(speechOutput).listen(repromptSpeech).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "GetRepairPaymentStatusIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            getRepairPaymentStatus(claimId, function (res) {
                speechOutput = res;
            });
        } else {
            speechOutput = "Please provide the claim number.";
        }
        this.response.speak(speechOutput).listen(repromptSpeech).shouldEndSession(false);
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

function getClaimStatus(claimId, callback) {
    var speechOutput = "<s>According to our records, the current status of claim with ID <break strength=\"medium\" />";
    speechOutput += "<say-as interpret-as='digits'> " + claimId + " </say-as>, is ON HOLD.";
    speechOutput += "The reason for the same is <break strength=\"medium\" /> Invoice Not Submitted.</s>";
    callback(speechOutput);
}

function getRepairPaymentStatus(claimId, callback) {
    var speechOutput = "<s>This claim is ,<break strength=\"medium\" /> Paid in Full.";
    speechOutput += "The amount of $150.55 is credited to your bank account number <break strength=\"medium\" />";
    speechOutput += "<say-as interpret-as=\"spell - out\">ABC121212</say-as> on 1st April 2018 at 3:00 PM GMT.</s>";
    callback(speechOutput);
}
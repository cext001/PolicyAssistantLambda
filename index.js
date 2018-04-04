'use strict';
const Alexa = require('alexa-sdk');
const helper = require('./helper');

const languageStrings = require('./language');
const APP_ID = "amzn1.ask.skill.ed110c90-9b28-4c38-9893-4abc77f702dd";
const SKILL_NAME = 'policy assistant';

const handlers = {
    'LaunchRequest': function () {
        this.emit(':ask', this.t('HELLO_MESSAGE'), this.t('HELP_MESSAGE'));
    },
    'AMAZON.HelpIntent': function () {
        this.response.speak(this.t('HELP_MESSAGE')).listen(this.t('HELP_REPROMPT'));
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.speak(this.t('STOP_MESSAGE'));
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.response.speak(this.t('STOP_MESSAGE'));
        this.emit(':responseReady');
    },
    "GetClaimStatusIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            helper.getClaimStatus(claimId, function (res) {
                speechOutput = res;
            });
        } else {
            speechOutput = "Please provide the claim number.";
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "GetRepairPaymentStatusIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            helper.getRepairPaymentStatus(claimId, function (res) {
                speechOutput = res;
            });
        } else {
            speechOutput = "Please provide the claim number.";
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    }
};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
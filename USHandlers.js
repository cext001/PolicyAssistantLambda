const helper = require('./helper');

var claimId;
var claimStatusIntentInvoked = false;

module.exports = {
    'LaunchRequest': function () {
        this.emit(':ask', this.t('HELLO_MESSAGE'), this.t('HELP_MESSAGE'));
    },
    'DULaunchRequest': function () {
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
    "claimStatusIntent": function () {
        var speechOutput;
        claimStatusIntentInvoked = true;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            if (claimId.length !== 11) {
                console.log('INVALID_CLAIM_ID');
                speechOutput = this.t('INVALID_CLAIM_ID');
            } else {                
                return helper.getClaimStatus(claimId).then((result) => {
                    speechOutput = result;
                }).catch((err) => {
                    speechOutput = err;
                });
                console.log('API CALL SUCCESS: ' + speechOutput);
            }
        } else {
            console.log('CLAIM_ID_NEEDED');
            speechOutput = this.t('CLAIM_ID_NEEDED');
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "claimIdIntent": function () {
        var speechOutput;
        claimId = this.event.request.intent.slots.claimId.value;
        if (claimId.length === 11) {
            if (claimStatusIntentInvoked) {
                return helper.getClaimStatus(claimId).then((result) => {
                    speechOutput = result;
                }).catch((err) => {
                    speechOutput = err;
                });
                console.log('API CALL SUCCESS: ' + speechOutput);
            }
        } else {
            console.log('INVALID_CLAIM_ID');
            speechOutput = this.t('INVALID_CLAIM_ID');
        }
    },
    "repairPaymentIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            helper.getRepairPaymentStatus(claimId, function (res) {
                speechOutput = res;
            });
        } else {
            speechOutput = this.t('CLAIM_ID_NEEDED');
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    }
};
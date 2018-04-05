const helper = require('./helper');

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
    "GetClaimStatusIntent": function () {
        var speechOutput;
        var claimId;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            return helper.getClaimStatus(claimId).then((result) => {
                speechOutput = result;
                this.response.speak(speechOutput).shouldEndSession(false);
                this.emit(':responseReady');
            }).catch((err) => {
                speechOutput = err;
                this.response.speak(speechOutput).shouldEndSession(false);
                this.emit(':responseReady');
            });
        } else {
            speechOutput = "<s>Please provide the claim number.</s>";
            this.response.speak(speechOutput).shouldEndSession(false);
            this.emit(':responseReady');
        }
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
    },
    "DUGetClaimStatusIntent": function () {
        this.emit(':ask', this.t('HELLO_MESSAGE'));
    }
};
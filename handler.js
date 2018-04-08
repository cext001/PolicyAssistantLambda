const helper = require('./helper');

var claimId = '';;
var rentalStartDate = '';
var rentalDays = '';
var claimStatusIntentInvoked = false;
var repairPaymentIntentInvoked = false;
var repairPaymentDetailsIntentInvoked = false;
var rentalCarIntentInvoked = false;
var claimPaymentDetails = {};

var self = {
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
                claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
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
        if (claimStatusIntentInvoked) {
            self.claimStatusIntent;
        } else if (repairPaymentIntentInvoked) {
            self.repairPaymentIntent;
        } else if (rentalCarIntentInvoked) {
            self.rentalCarIntent;
        }
        console.log("Speech output: " + speechOutput);
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "repairPaymentIntent": function () {
        var speechOutput;
        repairPaymentIntentInvoked = true;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            if (claimId.length !== 11) {
                console.log('INVALID_CLAIM_ID');
                speechOutput = this.t('INVALID_CLAIM_ID');
            } else {
                claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
                return helper.getClaimPaymentDetails(claimId).then((result) => {
                    claimPaymentDetails = result;
                    speechOutput = "The payment status is " + result.paymentStatus;
                }).catch((err) => {
                    speechOutput = err;
                });
            }
        } else {
            speechOutput = this.t('CLAIM_ID_NEEDED');
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "repairPaymentDetailsIntent": function () {
        var speechOutput;
        repairPaymentDetailsIntentInvoked = true;
        if (claimId) {
            self.getRepairPaymentDetailsMessage(function (result) {
                speechOutput = "The payment status is " + result.paymentStatus;
            });
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "getRepairPaymentDetailsMessage": function (callback) {
        var speechOutput = '<s>The amount of $' + claimPaymentDetails.totalPayments.amount + ' is credited to your bank account number';
        speechOutput += '<break strength=\"medium\" /> <say-as interpret-as="spell-out">' + claimPaymentDetails.bankAccountNumber + '</say-as>';
        speechOutput += 'on ' + claimPaymentDetails.paymentDate + '.</s>';
        callback(say);
    },
    "rentalCarIntent": function () {
        var speechOutput;
        rentalCarIntentInvoked = true;
        if (this.event.request.intent.slots.claimId.value) {
            claimId = this.event.request.intent.slots.claimId.value;
            console.log('claimId:' + claimId);
            if (claimId.length !== 11) {
                console.log('INVALID_CLAIM_ID');
                speechOutput = this.t('INVALID_CLAIM_ID');
            } else {
                claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
                return helper.getRentalCarStatus(claimId).then((result) => {
                    speechOutput = result;
                }).catch((err) => {
                    speechOutput = "<s> Something went wrong while processing your request. Please try again</s>";
                })
            }
        } else {
            speechOutput = this.t('CLAIM_ID_NEEDED');
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "rentalDetailsIntent": function () {
        var speechOutput;
        console.log(this.event.request.intent.slots);
        if (this.event.request.intent.slots.startDate.value && rentalStartDate == '') {
            rentalStartDate = request.data.request.intent.slots.startDate.value;
            console.log(rentalStartDate);
            speechOutput = "<s> Can you tell me for how many days you would require the rental car service?</s>";
        }
        if (rentalStartDate == '') {
            speechOutput = "<s> Can you let me know the start date of the rental car service?</s>";
        }
        if (request.data.request.intent.slots.days.value && rentalDays == '') {
            rentalDays = this.event.request.intent.slots.days.value;
            return helper.getRentalConfirmation(claimId, rentalStartDate, rentalDays).then((result) => {
                speechOutput = result;
                console.log('after call', speechOutput);
            }).catch((err) => {
                speechOutput = "<s> Something went wrong while processing your request. Please try again</s>";
            })
        }
        if (rentalDays == '') {
            speechOutput = "<s> Can you tell me for how many days you would require the rental car service?</s>";
        }
        this.response.speak(speechOutput).shouldEndSession(false);
        this.emit(':responseReady');
    },
    "thankIntent": function () {
        self.resetAll();
        var speechOutput = "<s> Happy to help you!</s>";
        this.response.speak(speechOutput).shouldEndSession(true);
        this.emit(':responseReady');
    },
    "resetAll": function () {
        var claimId = '';;
        var rentalStartDate = '';
        var rentalDays = '';
        var claimStatusIntentInvoked = false;
        var repairPaymentIntentInvoked = false;
        var repairPaymentDetailsIntentInvoked = false;
        var rentalCarIntentInvoked = false;
        var claimPaymentDetails = {};
    }
};

module.exports = self;
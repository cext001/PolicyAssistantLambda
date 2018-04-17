'use strict';

const alexa = require('alexa-app'),
const helper = require('./helper');

const app = express();
const alexaApp = new alexa.app("claimassistant");
app.id = require('./package.json').alexa.applicationId;

alexaApp.error = function (e, req, res) {
    console.log("Error in Alexa");
    console.log(e);
    console.log(req);
    throw e;
};

var claimStatusIntentCalled = false;
var rentalCarIntentCalled = false;
var repairPaymentIntentCalled = false;
var claimIdPresent = false;
var rentalStartDate = '';
var rentalDays = '';
var claimId = '';
var locale = '';
var claimPaymentDetails = {};
var paymentStatus = '';

alexaApp.launch(function (request, response) {
    console.log('launch ' + JSON.stringify(request));
    console.log('Session Obj ' + JSON.stringify(request.getSession()));
    console.log('Session Obj is new ' + request.getSession().isNew());
    locale = request.data.request.locale;
    var say = [];
    if (request.getSession().isNew()) {
        claimStatusIntentCalled = false;
        rentalCarIntentCalled = false;
        repairPaymentIntentCalled = false;
        claimIdPresent = false;
        rentalStartDate = '';
        rentalDays = '';
        claimId = '';
        claimPaymentDetails = {};
        say.push('<s>Hi</s>');
        say.push('<s>Welcome to Claim Assistant. <break strength="medium" /></s>');
        say.push('<s>What can I do for you <break strength="medium" /></s>');
        response.shouldEndSession(false);
        response.say(say.join('\n'));
        response.send();

    } else {
        console.log('----Access Token not available----');
    }
});

alexaApp.intent('claimStatusIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    claimStatusIntentCalled = true;
    console.log(request.data.request.intent.slots)
    var say = [];
    if (request.data.request.intent.slots.claimId.value) {
        claimId = request.data.request.intent.slots.claimId.value;
        console.log('claimId:' + claimId);
        if (claimId.length == 11) {
            claimIdPresent = true;
            claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
            return helper.getClaimStatus(claimId).then((result) => {
                say = result;
                console.log('after call', say);
                response.shouldEndSession(false);
                response.say(say.join('\n'));

            }).catch((err) => {
                say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
                response.shouldEndSession(true);
                response.say(say.join('\n'));
            })
        }
        else {
            say = ['<s>please enter the complete claim number</s>'];
            response.shouldEndSession(false);
            response.say(say.join('\n'));
        }
    }
    else {
        say = ["<s>Please provide the claim number. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('repairPaymentIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');

    repairPaymentIntentCalled = true;
    console.log('inside repairPaymentIntent');
    console.log(request.data.request.intent.slots)
    var say = [];
    console.log(request.data.request.intent.slots.claimId.value);
    if (request.data.request.intent.slots.claimId.value) {
        claimId = request.data.request.intent.slots.claimId.value;
        console.log('claimId:' + claimId);
        if (claimId.length == 11) {
            claimIdPresent = true;
            claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));

            return helper.getClaimPaymentDetails(claimId).then((result) => {
                say = "The payment status is " + result.paymentStatus;
                claimPaymentDetails = result;
            }).catch((err) => {
                say = err;
            })

            console.log(say);
        }
        else {
            say = ['<s>please enter the complete claim number</s>'];
            response.shouldEndSession(false);
            response.say(say.join('\n'));
        }
    }
    else {
        say = ["<s>Please provide the claim number. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('rentalCarIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    rentalCarIntentCalled = true;
    console.log('inside rentalCarIntent');
    console.log(request.data.request.intent.slots)
    var say = [];

    if (request.data.request.intent.slots.claimId.value) {
        claimId = request.data.request.intent.slots.claimId.vaalue;
        console.log('claimId:' + claimId);
        if (claimId.length == 11) {
            claimIdPresent = true;
            claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
            return helper.getRentalCarStatus(claimId).then((result) => {
                say = result;
                console.log('after call', say);
                response.shouldEndSession(false);
                response.say(say.join('\n'));
            }).catch((err) => {
                say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
                response.shouldEndSession(true);
                response.say(say.join('\n'));
            })
            console.log(say);
        }
        else {
            say = ['<s>please enter the complete claim number</s>'];
            response.shouldEndSession(false);
            response.say(say.join('\n'));
        }
    }
    else {
        say = ["<s>Please provide the claim number. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('claimIdIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ['default response'];
    console.log(request.data.request.intent.slots.claimId.value)
    claimId = request.data.request.intent.slots.claimId.value;
    console.log("claim id type" + typeof claimId.length);
    if (claimId.length == 11) {
        console.log('length 11');
        claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
        console.log('After change::', claimId);
        if (claimStatusIntentCalled) {
            console.log('Inside claimStatusIntentCalled');
            return helper.getClaimStatus(claimId).then((result) => {
                say = result;
                console.log('after call', say);
                response.shouldEndSession(false);
                response.say(say.join('\n'));

            }).catch((err) => {
                say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
                response.shouldEndSession(true);
                response.say(say.join('\n'));
            })
        }
        else if (repairPaymentIntentCalled) {
            console.log("inside api call");
            return helper.getClaimPaymentDetails(claimId).then((result) => {
                say = ["<s> The payment status is " + result.paymentStatus + "</s>"];
                claimPaymentDetails = result;
                paymentStatus = claimPaymentDetails.paymentStatus;
                console.log('after call', say);
                response.shouldEndSession(false);
                response.say(say.join('\n'));
            }).catch((err) => {
                say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
                response.shouldEndSession(true);
                response.say(say.join('\n'));
            })
            console.log(say);
        }
        else if (rentalCarIntentCalled) {
            return helper.getRentalCarStatus(claimId).then((result) => {
                say = result;
                console.log('after call', say);
                response.shouldEndSession(false);
                response.say(say.join('\n'));
            }).catch((err) => {
                say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
                response.shouldEndSession(true);
                response.say(say.join('\n'));
            })
        }
    }
    else {
        console.log('length not 11');
        say = ['<s>please enter the complete claim number</s>'];
        response.shouldEndSession(false);
        response.say(say.join('\n'));
    }

});


alexaApp.intent('GermanClaimStatusIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    claimStatusIntentCalled = true;
    console.log(request.data.request.intent.slots)
    var say = [];

    if (request.data.request.intent.slots.claimId.value) {
        claimId = request.data.request.intent.slots.claimId.value;
        console.log('claimId:' + claimId);
        claimIdPresent = true;
        claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
        return helper.getClaimStatusGerman(claimId).then((result) => {
            say = result;
            console.log('after call', say);
            response.shouldEndSession(false);
            response.say(say.join('\n'));

        }).catch((err) => {
            say = ["<s> Bei der Bearbeitung Ihrer Anfrage ist ein Fehler aufgetreten.</s><s>Bitte versuche es erneut</s>"];
            response.shouldEndSession(true);
            response.say(say.join('\n'));
        })
    }
    else {
        say = ["<s>Bitte geben Sie die Anspruchsnummer an. <break strength=\"medium\" /></s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});



alexaApp.intent('GermanClaimIdIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = [];
    console.log(request.data.request.intent.slots.claimId.value)
    claimId = request.data.request.intent.slots.claimId.value;
    claimId = (claimId.replace(/(\d{3})(\d{2})(\d{6})/, "$1-$2-$3"));
    if (claimStatusIntentCalled) {
        return helper.getClaimStatusGerman(claimId).then((result) => {
            say = result;
            console.log('after call', say);
            response.shouldEndSession(false);
            response.say(say.join('\n'));

        }).catch((err) => {
            say = ["<s> Bei der Bearbeitung Ihrer Anfrage ist ein Fehler aufgetreten.</s><s>Bitte versuche es erneut</s>"];
            response.shouldEndSession(true);
            response.say(say.join('\n'));
        })
    }
});

alexaApp.intent('rentalConfirmIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s> As per your policy, you are eligible for 30 days rental car service not exceeding $35 a day.</s>"];
    say.push('<s> Can you let me know the start date of the rental car service?</s>');
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('rentalCancelIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s> Okay,But you can book a rental car later!</s>"];
    response.shouldEndSession(true);
    response.say(say.join('\n'));
    resetAll();
});

alexaApp.intent('rentalDetailsIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = [];
    console.log(request.data.request.intent.slots);
    if (request.data.request.intent.slots.startDate.value && rentalStartDate == '') {
        rentalStartDate = request.data.request.intent.slots.startDate.value;
        console.log(rentalStartDate);
        say = ["<s> Can you tell me for how many days you would require the rental car service?</s>"];
    }
    if (rentalStartDate == '') {
        say = ["<s> Can you let me know the start date of the rental car service?</s>"];
    }
    if (request.data.request.intent.slots.days.value && rentalDays == '') {
        rentalDays = request.data.request.intent.slots.days.value;
        return helper.getRentalConfirmation(claimId, rentalStartDate, rentalDays).then((result) => {
            say = result;
            console.log('after call', say);
            response.shouldEndSession(false);
            response.say(say.join('\n'));
        }).catch((err) => {
            say = ["<s> Something went wrong while processing your request.</s><s>Please try again</s>"];
            response.shouldEndSession(true);
            response.say(say.join('\n'));
        })
    }
    if (rentalDays == '') {
        say = ["<s> Can you tell me for how many days you would require the rental car service?</s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

alexaApp.intent('GermanWelcomeIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s> Willkommen beim Politikassistenten.</s><s>Was kann ich für Dich tun</s>"];
    response.shouldEndSession(true);
    response.say(say.join('\n'));
    resetAll();
});

alexaApp.intent('thankIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = ["<s> Happy to help you!</s>"];
    response.shouldEndSession(true);
    response.say(say.join('\n'));
    resetAll();
});


if (process.argv.length > 2) {
    var arg = process.argv[2];
    if (arg === '-s' || arg === '--schema') {
        console.log(alexaApp.schema());
    }
    if (arg === '-u' || arg === '--utterances') {
        console.log(alexaApp.utterances());
    }
}

function getRepairPaymentDetailsMessage(callback) {
    var say = ['<s>The amount of $' + claimPaymentDetails.totalPayments.amount + ' is credited to your bank account number <break strength=\"medium\" /> <say-as interpret-as="spell-out">' + claimPaymentDetails.bankAccountNumber + '</say-as> </s>'];
    say.push('<s>on ' + claimPaymentDetails.paymentDate + '.</s>');
    callback(say);
}

function resetAll() {
    claimStatusIntentCalled = false;
    rentalCarIntentCalled = false;
    repairPaymentIntentCalled = false;
    claimIdPresent = false;
    rentalStartDate = '';
    rentalDays = '';
    claimId = '';
    locale = '';
    claimPaymentDetails = {};
    paymentStatus = '';
}

alexaApp.intent('repairPaymentDetailsIntent', function (request, response) {
    var all = JSON.parse(request.session('all') || '{}');
    var say = [];
    console.log('repairPaymentDetailsIntent');
    console.log(claimPaymentDetails);
    console.log(repairPaymentIntentCalled);
    console.log(paymentStatus);
    console.log(typeof paymentStatus);
    console.log(Object.keys(claimPaymentDetails).length);

    if ((Object.keys(claimPaymentDetails).length != 0) && repairPaymentIntentCalled && (paymentStatus == "Issued" || paymentStatus == "Cleared")) {
        getRepairPaymentDetailsMessage(function (result) {
            say = result;
        });
    } else {
        say = ["<s>Since the payment status is " + claimPaymentDetails.paymentStatus + ", we are unavailable to provide the details.</s>"];
    }
    response.shouldEndSession(false);
    response.say(say.join('\n'));
});

const server = app.listen(process.env.PORT || 5000, () => {
    console.log('Express server listening on port %d in %s mode', server.address().port, app.settings.env);
});
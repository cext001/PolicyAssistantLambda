'use strict';
const Alexa = require('alexa-sdk');
const USHandlers = require('./handler');

const APP_ID = "amzn1.ask.skill.ed110c90-9b28-4c38-9893-4abc77f702dd";
const SKILL_NAME = 'policy assistant';

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    const LOCALE = event.request.locale;
    alexa.registerHandlers(USHandlers);
    alexa.execute();
};
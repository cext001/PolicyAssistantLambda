module.exports = {
    getClaimStatus: function (claimId, callback) {
        var speechOutput = "<s>According to our records, the current status of claim with ID <break strength=\"medium\" />";
        speechOutput += "<say-as interpret-as='digits'> " + claimId + " </say-as>, is ON HOLD.";
        speechOutput += "The reason for the same is <break strength=\"medium\" /> Invoice Not Submitted.</s>";
        callback(speechOutput);
    },
    getRepairPaymentStatus: function (claimId, callback) {
        var speechOutput = "<s>This claim is ,<break strength=\"medium\" /> Paid in Full.";
        speechOutput += "The amount of $150.55 is credited to your bank account number <break strength=\"medium\" />";
        speechOutput += "<say-as interpret-as=\"spell - out\">ABC121212</say-as> on 1st April 2018 at 3:00 PM GMT.</s>";
        callback(speechOutput);
    }
};
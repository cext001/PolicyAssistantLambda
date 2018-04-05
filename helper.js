const request = require('request'); 

module.exports = {
    getClaimStatus: function (claimId) {
        return new Promise(function (resolve, reject) {
            var speechOutput;
            var options = {
                method: 'POST',
                url: 'http://35.154.116.87:8080/cc/service/edge/claim/vhv',
                headers: { 'cache-control': 'no-cache', authorization: 'Basic c3U6Z3c=', 'content-type': 'application/json' },
                body: { jsonrpc: '2.0', method: 'getClaimSummary', params: [claimId] },
                json: true
            };
            
            request(options, function (error, response, body) {                
                if (error) {
                    speechOutput = "<s>Something went wrong. Please try again</s>";
                    resolve(speechOutput);
                } else {
                    if(body.hasOwnProperty('error')){
                        speechOutput = "<s>"+body.error.message+"</s>";
                    } else {
                        speechOutput = "<s>According to our records, the current status of claim with ID <break strength=\"medium\" /> <say-as interpret-as='digits'> " + claimId + " </say-as>, is " + body.result.currentClaimStatus + ".</s>";
                        if (body.result.currentClaimStatus === "On Hold") {
                            speechOutput +='<s>The reason for the same is <break strength=\"medium\" />' + body.result.reason + '.</s>';
                        }
                    }                    
                    resolve(speechOutput);
                }
            });
        });
    },
    getRepairPaymentStatus: function (claimId, callback) {
        var speechOutput = "<s>This claim is ,<break strength=\"medium\" /> Paid in Full.";
        speechOutput += "The amount of $150.55 is credited to your bank account number <break strength=\"medium\" />";
        speechOutput += "<say-as interpret-as=\"spell - out\">ABC121212</say-as> on 1st April 2018 at 3:00 PM GMT.</s>";
        callback(speechOutput);
    }
};
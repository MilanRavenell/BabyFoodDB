// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const request = require('request');
const rp = require('request-promise');

class BabyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {
            // format is "what does xxx mean?"
            if (context.activity.text.includes("what does") &&
                context.activity.text.includes("mean?") &&
                context.activity.text.split(" ").length == 4) {

                await context.sendActivity(`You want '${context.activity.text.split(" ")[2]}' defined`);
                await context.sendActivity(`bitch`);

                console.log('fuck');

                // request.post({
                //     headers: {"a" : "b"},
                //     url: 'https://babyfoodapp.azurewebsites.net/',
                //     json: { acronym: `${context.activity.text.split(" ")[2]}` },
                //     async function(error, response, body) {
                //         context.sendActivity("hi");

                //         if (!error && response.statusCode == 200) {
                //             //console.log(body);
                //             await context.sendActivity(`It means '${body}'`);
                //         }
                //         console.log('fuuuuck');
                //     }
                // });
                context.sendActivity("running   ");
                const options = {
                   method: 'POST',
                   uri: 'https://babyfoodapp.azurewebsites.net/',
                   body: {
                       foo: 'bar'
                   },
                   json: true
                // JSON stringifies the body automatically
                };

                rp(options)
                   .then(async function (response) {
                       // Handle the response
                       await context.sendActivity("success");
                       //console.log('fuuuuuuck');
                   })
                   .catch(async function (err) {
                       // Deal with the error
                       await context.sendActivity("success2");
                       console.log('fuuuuuuuuuuuucckk');
                   });
            }

            await next();

        });
    }

}

module.exports.BabyBot = BabyBot;
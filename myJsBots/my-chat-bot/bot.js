// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const rp = require('request-promise');

class BabyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // format is "what does xxx mean?"
            if (context.activity.text.includes("what does") &&
                context.activity.text.includes("mean?") &&
                context.activity.text.split(" ").length == 4) {

                var word = context.activity.text.split(" ")[2];
                await context.sendActivity(`You want '${word}' defined`);
                await context.sendActivity(`bitch`);

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/',
                    body: { acronym: `${ context.activity.text.split(" ")[2] }` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        await context.sendActivity(`${ response[0]["description"] }`);
                        console.log(JSON.stringify(response));
                    })
                    .catch(async function (err) {
                        await context.sendActivity("error");
                    });
            }

            await next();

        });
    }

}

module.exports.BabyBot = BabyBot;
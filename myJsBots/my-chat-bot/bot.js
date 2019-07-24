// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const rp = require('request-promise');

class BabyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // format is "what does xxx mean?"
            var message = context.activity.text.split(" ");
            console.log(message);
            if (message.length == 4 &&
                message[0] == "what" &&
                message[1] == "does" &&
                message[3] == "mean?")
            {

                var word = message[2];

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/retrieve',
                    body: { acronym: `${ word }` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        if (response.length == 0) {
                            await context.sendActivity(`Sorry, ${word} hasn't been added yet. You can add a description with:\n\n \"${word} means <description>\"`);
                        }
                        else {
                            for (var i = 0; i < response.length; i++) {
                                await context.sendActivity(`${ response[i]["Description"] }`);
                            }
                        }  
                        console.log(response);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });
            } else if (message.length > 2 && message[1] == "means") {
                var word = message[0];
                var description = message.slice(2, message.length);

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/add',
                    body: { acronym: `${ word }`, description: `${description}` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        await context.sendActivity(`${word} has been added. Thanks!`);
                        console.log(response);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });
            }

            await next();

        });
    }

}

module.exports.BabyBot = BabyBot;
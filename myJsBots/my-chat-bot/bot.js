// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const rp = require('request-promise');

class BabyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {

            var message = context.activity.text.split(" ");
            console.log(message);

            // asking for definition
            // format: "What does <word> mean?
            if (message.length == 4 &&
                message[0] == "What" &&
                message[1] == "does" &&
                message[3] == "mean?") {

                var word = message[2];

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/retrieve',
                    body: { acronym: `${word}` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {    //no definition
                        if (response.length == 0) {
                            await context.sendActivity(`Sorry, ${word} hasn't been added yet. You can add a description with:\n\n \"${word} means <description>\"`);
                        }
                        else {                          //return definitions
                            if (response.length > 1) {
                                await context.sendActivity(`Multiple definitions were found:`);
                            }
                            for (var i = 0; i < response.length; i++) {
                                await context.sendActivity(`${response[i]["Description"]}`);
                            }
                        }
                        console.log(response);
                        console.log(`name: ${context.activity.from.name}`);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });

                // defining the word
                // format: "<word> means <def>"
            } else if (message.length > 3 && message[1] == "means") {
                var word = message[0];
                var description = message.slice(2, message.length).join(' ');

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/add',
                    body: { acronym: `${word}`, description: `${description}` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        await context.sendActivity(`${word} has been added. Thanks!`);
                        console.log(response);
                        console.log(`name: ${context.activity.name}`);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });
                //update word
                // format: "Update <word> to <def>"
            } else if (message.length > 3 && message[0] == "Update") {

                ////format: "Update <word> <optional #> <>"
                ////var j = 0; //optional #
                ////var slicei = 2; //start of slice dependant on #
                ////// isnumeric
                ////if (!isNaN(parseFloat(message[2])) && isFinite(message[2])) {

                ////    j = message[2];
                ////    slicei = 3;
                ////}

                var word = message[1];
                var description = message.slice(3, message.length);
                var index = 1;

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/update',
                    body: { acronym: `${word}`, description: `${description}`, index: `${index}` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        await context.sendActivity(`${word} has been updated. Thanks!`);
                        console.log(response);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });

            } else if (message.length > 2 && message[1] == "means") {
                acronym = message[0];
                description = message.slice(2, message.length).join(' ');
                alias = context.activity.from.name;
                getTeam = true;

                await context.sendActivity('What team do you want to affiliate with this acronym?');

            }

            await next();
        });
    }

}

module.exports.BabyBot = BabyBot;
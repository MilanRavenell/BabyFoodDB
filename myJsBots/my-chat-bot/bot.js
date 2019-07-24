// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const rp = require('request-promise');

var getTeam = false;
var acronym = "";
var description = "";
var alias = "";

class BabyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // format is "what does xxx mean?"
            var message = context.activity.text.split(" ");
            console.log(message);

            // User is trying to add word and we just asked for team afiliation
            if (getTeam) {
                getTeam = false;
                var team = message.join(" ");

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/add',
                    body: { 
                        acronym: `${ acronym }`, 
                        description: `${description}`,
                        team: `${team}`,
                        alias: `${alias}` 
                    },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        await context.sendActivity(`${acronym} has been added. Thanks!`);
                        console.log(response);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });
            }

            // User is trying to get definition of word
            else if (message.length == 4 &&
                message[0] == "what" &&
                message[1] == "does" &&
                message[3] == "mean?")
            {

                acronym = message[2];

                const options = {
                    method: 'POST',
                    uri: 'https://babyfoodapp.azurewebsites.net/retrieve',
                    body: { acronym: `${ acronym }` },
                    json: true,
                    rejectUnauthorized: false,
                    requestCert: false,
                    agent: false
                };

                await rp(options)
                    .then(async function (response) {
                        if (response.length == 0) {
                            await context.sendActivity(`Sorry, ${acronym} hasn't been added yet. You can add a description with:\n\n \"${acronym} means <description>\"`);
                        }
                        else {
                            for (var i = 0; i < response.length; i++) {
                                await context.sendActivity(`${ response[i]["Description"] }`);
                            }
                        }  
                        console.log(response);
                        console.log(`name: ${context.activity.from.name}`);
                    })
                    .catch(async function (err) {
                        console.log(err);
                    });
            } 

            // User is trying to add definition to aronym
            else if (message.length > 2 && message[1] == "means") {
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
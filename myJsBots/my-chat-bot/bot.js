// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
const rp = require('request-promise');

var getTeamAddDef = false;
var getTeamDisambig = false;
var acronym = "";
var description = "";
var alias = "";

var ambigTeamList = []
var ambigDescList = []

class BabyBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {
            // format is "what does xxx mean?"
            var message = context.activity.text.split(" ");

            // User is trying to add word and we just asked for team afiliation
            if (getTeamAddDef) {
                getTeamAddDef = false;
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

            // There were multiple instances of acronym user wants, User picks desired team afiliation
            else if (getTeamDisambig) {
                var team = message.join(" ");

                var indx = ambigTeamList.indexOf(team);
                if (indx >= 0) {
                    await context.sendActivity(`${ambigDescList[indx]}`);

                    // Reset variables
                    getTeamDisambig = false;
                    ambigDescList = [];
                    ambigTeamList = [];
                } else {
                    await context.sendActivity(`Please choose an team from the list`);
                }
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
                        else if (response.length == 1) {
                            await context.sendActivity(`${ response[0]["Description"] }`);
                        }
                        else {
                            getTeamDisambig = true;

                            for (var i = 0; i < response.length; i++) {
                                ambigTeamList.push(response[i]["team"]);
                                ambigDescList.push(response[i]["Description"]);
                            }
                            await context.sendActivity(`We have found multiple instances of this acronym:\n\n ${ambigTeamList.join(", ")}\n\n Which team afiliation are you looking for?`);
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
                getTeamAddDef = true;

                await context.sendActivity('What team do you want to affiliate with this acronym?');
            }

            //update word
            // format: "Update <word> to <def>"
            else if (message.length > 3 && message[0] == "Update") {

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
                    body: { acronym: `${word}`, description: `${description}` , index: `${index}`},
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
            }

            await next();
        });
    }
}

module.exports.BabyBot = BabyBot;
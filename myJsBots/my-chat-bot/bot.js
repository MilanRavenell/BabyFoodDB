// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler } = require('botbuilder');
    var request = require('request');



class babyBot extends ActivityHandler {
    constructor() {
        super();
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {

            if (context.activity.text == "hi") {
                await context.sendActivity(`You said '${context.activity.text}'`);

                request.post(
                    {
                        url: 'http://www.babyfooddb.azurewebsites.net/',
                        form: { "acronym": context.activity.text }
                    }
                );

                await next();

            }
        });
    }

    // azurewebsites.net/?acronym=x
}

module.exports.babyBot = babyBot;
const __ = require('iterate-js');
const tokenFromFile = require('./resources/token.js');

module.exports = function (bot, config)
{

    bot.config = new __.lib.Config({
        command: new __.lib.Config({
            symbol: '!'
        }),

        discord: new __.lib.Config({
            token: tokenFromFile,
            manage: new __.lib.Config({
                channels: []
            })
        })
    });
    bot.config.update(config);
};
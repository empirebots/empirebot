const fs = require('fs');
const __ = require('iterate-js');
const Discord = require('discord.js');
const config = require('./config.js');
const modules = __.map(fs.readdirSync('./resources/modules'), mod => require(`./resources/modules/${mod}`));

module.exports = function (bot, cfg)
{
    bot.dir = __dirname;
    bot.client = new Discord.Client();

    config(bot, cfg);
    __.all(modules, mod => mod(bot));
    bot.client.on('ready', () =>
    {
        bot.client.user.setGame('Type !!help');

    });
};
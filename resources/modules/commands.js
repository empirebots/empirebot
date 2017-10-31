const fs = require('fs');
const Discord = require('discord.js');
const help = require('./../help');
var request = require('request');


module.exports = function (bot)
{
    bot.commands = {
        help: msg =>
        {
            let RichEmbed = new Discord.RichEmbed();
            RichEmbed.setColor("#63dded");
            RichEmbed.setThumbnail('https://imgur.com/uGJu3Jq.png');
            RichEmbed.setAuthor('Aitux#1457', 'https://imgur.com/uGJu3Jq.png', 'https://aitux.github.io');
            fs.readdir('resources/man', 'utf8', (err, files) =>
            {
                files.forEach((element) =>
                {
                    let strFinal;
                    let data = fs.readFileSync('resources/man/' + element, 'utf8');
                    let tabData = data.split('\n');
                    let flagBoolean = false, flag = false;
                    tabData.forEach((data) =>
                    {
                        if (flag)
                        {
                            strFinal = data;
                            flag = false;
                            console.log(strFinal);
                        }
                        if (flagBoolean)
                        {
                            flag = true;
                            flagBoolean = false;
                        }

                        if (data.includes('Synopsis'))
                        {
                            flagBoolean = true;
                        }
                    });
                    if (strFinal !== undefined)
                        RichEmbed.addField(element.substring(0, element.length - 3), strFinal, true);
                });
                msg.author.send(RichEmbed);
            });
        },
        man: msg =>
        {
            let tab = msg.content.split(' ');
            if (tab.length <= 1)
            {
                msg.channel.send("```bash\nMissingArgumentException\n```").catch();
            } else
            {
                let strCommand = tab[1];
                strCommand += '.md';
                if (help.command.indexOf(tab[1]) !== -1)
                {
                    let data = fs.readFileSync('resources/man/' + strCommand, 'utf8');
                    msg.author.send(data);
                } else
                {
                    msg.channel.send("`IllegalArgumentException`").catch();
                }
            }
        },
        meme: msg =>
        {
            let willBeParsed = msg.details;
            console.log(willBeParsed);
            let tab = parseMemeAPI(willBeParsed);
            let arg = msg.details.trim().split(' ');
            if (arg.length > 0 && arg[0] !== '')
            {
                if (help.id[arg[0]])
                {
                    if (tab[0] !== undefined)
                    {
                        if (tab[1] === undefined)
                            tab[1] = "";
                        getResponseMemeAPI(arg[0], tab[0], tab[1], msg);
                    }
                    else
                        msg.channel.send("`IllegalArgumentException`\n\n Use `" + bot.config.command.symbol + "man meme` to learn more about this command.").catch();
                } else
                {
                    msg.channel.send("`IllegalArgumentException`").catch();
                    let strFinal = "";
                    Object.keys(help.id).forEach(function (key)
                    {
                        strFinal += key + "\n";
                    });
                    msg.channel.send("**Expected**: \n```" + strFinal + "```\n**Found**: `" + arg[0] + "`");
                }
            } else
            {
                console.log(`Argument: ${msg.details.split(' ')}`);
                msg.channel.send("`MissingArgumentException`").catch();
            }
        },
        poll: msg =>
        {

        }
    };
};

function parseMemeAPI(msg)
{
    let splitted = msg.split('\"');
    let tab = [];
    tab.push(splitted[1]);
    tab.push(splitted[3]);
    console.log("Split 1: " + tab[0]);
    console.log("Split 2: " + tab[1]);
    return tab;
}

let getResponseMemeAPI = function (cmd, text1, text2, msg)
{
    let str = "https://api.imgflip.com/caption_image?template_id=" + help.id[cmd] + "&username=" + help.email + "&password=" + help.password + "&text0=" + text1 + "&text1=" + text2;
    request.post(
        str,
        function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                let data = JSON.parse(body);
                console.log(data);
                let url = data.data.url;
                msg.channel.send(url);
            }
        }
    );

};
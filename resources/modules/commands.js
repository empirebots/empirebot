const fs = require('fs');
const Discord = require('discord.js');
const help = require('./../help');
const request = require('request');
const weather = require("./../weather");


module.exports = function (bot)
{
    bot.commands = {
        help: msg =>
        {
            console.log("HELP: (" + msg.details + ") called by: " + msg.guild);
            let RichEmbed = new Discord.RichEmbed();
            RichEmbed.setColor("#63dded");
            RichEmbed.setThumbnail('https://imgur.com/uGJu3Jq.png');
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
            console.log("MAN: (" + msg.details + ") called by: " + msg.guild);
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
            console.log("MEME: (" + msg.details + ") called by: " + msg.guild);
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

        },
        weather: msg =>
        {
            console.log("WEATHER: (" + msg.details + ") called by: " + msg.guild);
            let args = msg.details.trim().split(' ');
            if (args.length > 0 && args[0] !== '')
            {
                getResponseWeatherAPI(msg.details, tab =>
                {
                    if (tab.length !== 1)
                    {
                        let embed = new Discord.RichEmbed();
                        embed.setColor("#18a2f2");
                        embed.setAuthor(tab[0] + ', ' + tab[1], 'https://imgur.com/uGJu3Jq.png', 'https://aitux.github.io');
                        embed.addField(tab[2], tab[3], true);
                        embed.addField(tab[4], tab[5] + "°C", true);
                        let rise = new Date(tab[6] * 1000);
                        let set = new Date(tab[7] * 1000);
                        embed.addField(":sunrise:" + rise.getHours() + " : " + rise.getMinutes() + " : " + rise.getSeconds(), ":city_sunset:" + set.getHours() + " : " + set.getMinutes() + " : " + set.getSeconds(), true);

                        msg.channel.send(embed);

                    } else
                    {
                        msg.channel.send(tab[0]);
                    }
                });

            } else
            {
                msg.channel.send("`MissingArgumentException`").catch();
            }
        },
        intra: msg =>
        {
            console.log("INTRA: (" + msg.details + ") called by: " + msg.guild);
            console.log(msg.author.client.voiceConnections);
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

let getResponseWeatherAPI = function (place, callback)
{
    let str = "http://api.openweathermap.org/data/2.5/weather?q=" + place + "&APPID=" + help.weatherKey;
    request(str, function (error, response, body)
    {
        let data = JSON.parse(body);
        if (data.cod === 200)
        {
            let weahter2 = data.weather[0].main;
            let temp = kToC(data.main.temp);
            let info = [];
            info.push(data.name);
            info.push(data.sys.country);
            info.push(weahter2);
            info.push(data.weather[0].description);
            info.push(weather.getEquivalent(weahter2));
            info.push(temp);
            info.push(data.sys.sunrise);
            info.push(data.sys.sunset);
            callback(info);
        } else if (data.cod === "404")
        {
            callback(["`CityNotFoundException`"]);
        }
    });
};

function kToC(kelvin)
{
    let temp = kelvin - 273.15;
    return Math.round(temp * 10) / 10;
}
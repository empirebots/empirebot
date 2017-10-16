const fs = require('fs');
const Discord = require('discord.js');

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
                    console.log(element);
                    let data = fs.readFileSync('resources/man/' + element, 'utf8');
                    let tabData = data.split('\n');
                    let flagBoolean = false, flag = false;
                    console.log(tabData.length);
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
                let data = fs.readFileSync('resources/man/' + strCommand, 'utf8');
                msg.author.send(data);
                console.log(strCommand);
            }
        }
    };
};
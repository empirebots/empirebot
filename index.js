const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client();

let PREFIX = '!!';

client.on('ready', function () {
    console.log('Logged in as $(client.user.tag)');
});


client.on('message', msg => {
    if (msg.channel.type === 'text' && !msg.author.bot && msg.content.startsWith(PREFIX)) {
        msg.channel.send('Hell Yeah !').then(msg => {
            msg.react('👍').catch();
        }).catch();
    }

    if (msg.content.startsWith(PREFIX + 'help')) {
        let RichEmbed = new Discord.RichEmbed();
        RichEmbed.setColor("#63dded");
        RichEmbed.setTitle('Help');
        RichEmbed.setDescription('Here are few useful things that I should be able to do, in order to help you :smirk:');
        fs.readdir('resources/man', 'utf8', (err, files) => {
            files.forEach((element) => {
                let strFinal;
                console.log(element);
                let data = fs.readFileSync('resources/man/' + element, 'utf8');
                let tabData = data.split('\n');
                let flagBoolean = false, flag = false;
                console.log(tabData.length);
                tabData.forEach((data) => {

                    console.log(data);

                    if (flag) {
                        strFinal = data;
                        flag = false;
                        console.log(strFinal);
                    }
                    if (flagBoolean) {
                        flag = true;
                        flagBoolean = false;
                    }

                    if (data.includes('Synopsis')) {
                        console.log(data);
                        flagBoolean = true;
                    }
                });

                if (strFinal !== undefined)
                    RichEmbed.addField(element.substring(0, element.length - 3), strFinal, true);
            });

            msg.author.send(RichEmbed);
        });
    }

});
client.login('MzY3MDEzMzYyOTU1MTkwMjgy.DL1P1Q.mqEpmyWaiyhgFapVRLdJI9m3sWM');

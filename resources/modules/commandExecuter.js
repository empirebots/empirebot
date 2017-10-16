module.exports = function (bot)
{
    let parseMsg = (msg) => {
        msg.meta = msg.content.split(' ');
        let x = msg.meta.slice();
        msg.cmd = x.shift().replace(bot.config.command.symbol, '');
        msg.details = x.join(' ');
        return msg;
    };

    bot.console = {
        listen: function ()
        {

            bot.client.on('message', msg =>
            {
               if(msg.content.startsWith(bot.config.command.symbol)){
                   console.log(bot.config.command.symbol);
                   console.log('WORKING BITCH');
                   let data = parseMsg(msg),
                       cmd = bot.commands[data.cmd];
                   console.log('cmd: ' + cmd + ' data: ' + data);
                   if(cmd !== undefined)
                   {
                       console.log('Doing some NSFW things here !');
                       cmd(data);
                   }
               }
            });
        }

    }
};


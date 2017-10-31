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
                   let data = parseMsg(msg),
                       cmd = bot.commands[data.cmd];
                   if(cmd !== undefined)
                   {
                       cmd(data);
                   }
               }
            });
        }

    }
};


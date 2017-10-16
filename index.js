const Empire = require('./empire');
const token = require('./resources/token');
const bot = new Empire({
    command: {
        symbol: '!!' // command trigger
    },
    discord: {
        token: token[0]
    }
});
bot.connect().then(bot.console.listen());
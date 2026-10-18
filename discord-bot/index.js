require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const connectDB = require('./config/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration
  ]
});

client.commands = new Collection();
for (const file of fs.readdirSync('./commands').filter(f => f.endsWith('.js'))) {
  const command = require(path.join(__dirname, 'commands', file));
  client.commands.set(command.data.name, command);
}
for (const file of fs.readdirSync('./events').filter(f => f.endsWith('.js'))) {
  const event = require(path.join(__dirname, 'events', file));
  event.once ? client.once(event.name, (...a) => event.execute(...a))
             : client.on(event.name, (...a) => event.execute(...a));
}

(async () => {
  await connectDB();
  await client.login(process.env.TOKEN);
})();

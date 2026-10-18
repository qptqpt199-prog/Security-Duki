require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

const commands = fs.readdirSync('./commands').filter(f => f.endsWith('.js'))
  .map(f => require(path.join(__dirname, 'commands', f)).data.toJSON());

const rest = new REST().setToken(process.env.TOKEN);

(async () => {
  await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: commands });
  console.log('✅ Đã đăng ký slash commands!');
})();

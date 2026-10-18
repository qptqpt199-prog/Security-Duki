Setup Instructions

1. npm install
2. Configure .env file (bot token, client ID, MongoDB URI)
3. Privileged intents required in Discord Developer Portal -> Bot: Server Members Intent + Message Content Intent
4. Required bot permissions: Kick Members, Manage Channels, Manage Messages, Moderate Members (timeout)
5. npm run deploy -> register slash commands
6. npm start -> run the bot

Commands Usage

- /bl add <bot_id> <reason> — Add a bot to the blacklist
- /bl remove <bot_id> — Remove a bot from the blacklist
- /bl list — View the blacklist
- /config set_role <role> — Set the authorized role for creating channels and sending links
- /config set_spam <count> <seconds> <mute_minutes> — Customize anti-spam settings

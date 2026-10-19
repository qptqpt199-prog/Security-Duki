# Discord Security Bot

A lightweight and efficient Discord security bot built with Node.js and MongoDB to protect your server from unauthorized bots, spam, unwanted links, and unauthorized channel creation.

## Instructions

1. The command runs once the setup is complete.:
```bash
 npm install
```
2. Configure .env file (Bot Token, Client ID, MongoDB URI).

3. Required Privileged Intents in Discord Developer Portal (Bot section):
* Server Members Intent
* Message Content Intent

4. Required Bot Permissions:
* Kick Members
* Manage Channels
* Manage Messages
* Moderate Members (Timeout)

5. Register slash commands:
```bash
npm run deploy
```
6. Run the bot:
```bash
npm start
```
## Commands Usage

### Blacklist Commands
```bash
* /bl add <bot_id> <reason> — Add a bot to the blacklist
```
```bash
* /bl remove <bot_id> — Remove a bot from the blacklist
```
```bash
* /bl list — View the blacklist
```
### Configuration Commands
```bash
* /config set_role <role> — Set the authorized role for creating channels and sending links
```
```bash
* /config set_spam <count> <seconds> <mute_minutes> — Customize anti-spam settings
```

### Lưu ý
Nếu chưa cấu hình MONGO_URI đúng, các lệnh liên quan blacklist/config 
sẽ không phản hồi được. Vui lòng đảm bảo đã điền đúng chuỗi kết nối 
MongoDB trong file .env trước khi sử dụng.

# Discord:
[![Discord](https://img.shields.io/badge/Discord-Join%20server-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/T7N7Gqy5uF)

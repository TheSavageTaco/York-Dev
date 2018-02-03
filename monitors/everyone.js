exports.run = async (client, message, level) => { // eslint-disable-line no-unused-vars
  if (!message.guild || !message.member) return; // Second part is about webhooks.
  if (message.member.permLevel > 0) return;
  const everyoneRole = message.guild.roles.find(r => r.name.toLowerCase() === 'everyone');
  if (!everyoneRole) return;
  if (message.mentions.roles.size < 1) return;
  if (message.member.roles.has(everyoneRole.id)) return;
  if (message.mentions.roles && message.mentions.roles.has(everyoneRole.id)) {
    await message.member.addRole(everyoneRole);
    await message.reply('Welcome to the everyone role. Whenever someone mentions it, they get the role and everyone who has it is mentioned, leaving and rejoining to remove the role from yourself **WILL** result in a stricter punishment.');
  }
};
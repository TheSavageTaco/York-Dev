const Command = require(`${process.cwd()}/base/Command.js`);
const { inspect } = require('util');
const { post } = require('snekfetch');

class Eval extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Evaluates arbitrary Javascript.',
      category: 'System',
      usage: 'eval <expression>',
      extended: 'This is an extremely dangerous command, use with caution and never eval stuff strangers tell you.',
      aliases: ['ev'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const { client } = message;
    const { clean } = this;
    const code = args.join(' ');
    const token = client.token.split('').join('[^]{0,2}');
    const rev = client.token.split('').reverse().join('[^]{0,2}');
    const filter = new RegExp(`${token}|${rev}`, 'g');
    try {
      let output = eval(code);
      if (output instanceof Promise || (Boolean(output) && typeof output.then === 'function' && typeof output.catch === 'function')) output = await output;
      output = inspect(output, { depth: 0, maxArrayLength: null });
      output = output.replace(filter, '[TOKEN]');
      output = clean(output);
      if (output.length < 1950) {
        message.channel.send(`\`\`\`js\n${output}\n\`\`\``);
      } else {
        try {
          const { body } = await post('https://www.hastebin.com/documents').send(output);
          message.channel.send(`Output was to long so it was uploaded to hastebin https://www.hastebin.com/${body.key}.js `);
        } catch (error) {
          message.channel.send(`I tried to upload the output to hastebin but encountered this error ${error.name}:${error.message}`);
        }
      }
    } catch (error) {
      message.channel.send(`The following error occured \`\`\`js\n${error.stack}\`\`\``);
    }
  }

  clean(text)  {
    return text
      .replace(/`/g, '`' + String.fromCharCode(8203))
      .replace(/@/g, '@' + String.fromCharCode(8203));
  }
}

module.exports = Eval;

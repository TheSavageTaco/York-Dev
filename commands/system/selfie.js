/*
	This selfie command is only possible due to hosting my bot on my raspberry pi
	it has a webcam hooked up directly, and with using child_process with fswebcam
	I am able to take pictures on command, unless you're hosting your bot on a linux
	machine such as a home server, or raspberry pi with a webcam attached, you should
	delete this command from your folder.
*/
const fsn = require('fs-nextra');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const Command = require(`${process.cwd()}/base/Command.js`);

class Selfie extends Command {
  constructor(client) {
    super(client, {
      name: 'selfie',
      description: 'Smile!',
      usage: 'selfie',
      extended: 'This command will take a live image from a connected webcam.',
      aliases: [],
      permLevel: 'Bot Owner'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.delete();
    const [imgW, imgH] = [640, 480];
    await exec(`fswebcam -r ${imgW}x${imgH} --no-banner ./assets/selfie.jpg`);
    const image = await fsn.readFile('./assets/selfie.jpg');
    message.channel.send(args.join(' '), {files: [{ attachment: image, name: 'selfie.jpg'}]});
  }
  
}

module.exports = Selfie;
const Twit = require('twit');
const { RichEmbed, WebhookClient } = require('discord.js');


module.exports = client => {
  const hook = new WebhookClient(client.config.twitHookID, client.config.twitHookToken);
  const twitter = new Twit(client.config.twitter);
  const twStream = twitter.stream('statuses/filter', { follow: client.config.twitterUser });

  twStream.on('tweet', tweet => {
    if (tweet.retweeted_status || tweet.user.id_str != client.config.twitterUser || tweet.in_reply_to_status_id != null) return;

    const embed = new RichEmbed()
      .setColor('#1DA1F2')
      .setAuthor(`${tweet.user.name} (@${tweet.user.screen_name})`)
      .setURL(`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
      .setFooter('Twitter', 'http://evie.ban-hammered.me/i/0lr7k.png')
      .setTimestamp(new Date())
      .setDescription(tweet.text)
      .setThumbnail(tweet.user.profile_image_url);

    if (tweet.entities.media) embed.setImage(tweet.entities.media[0].media_url);
    hook.send({ embed });
  });

  twStream.on('connect', () => console.log('Twitter Module: Connecting to Twitter API'));
  twStream.on('connected', () => console.log('Twitter Module: Connected to Twitter API'));
  twStream.on('disconnect', () => console.log('Twitter Module: Disconnected from Twitter API'));
};
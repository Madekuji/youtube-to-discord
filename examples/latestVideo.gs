let webhook = `
  Paste webhooks here (make sure they're on seperate lines, if you're adding multiple.) Also, remove all this text...
`,
ytChannels = `
  Paste your YouTube channel IDs here (make sure they're on seperate lines, if you're adding multiple.)
  Your YouTube Channel ID will ALWAYS start with UC.
  Also, remove this all text...
`
mention = ``;


const props = PropertiesService.getScriptProperties();
function send2Discord() {
    ytChannels = ytChannels.split('\n');
    for (let channel of ytChannels) {
        channel = channel.trim();
        if (channel == '') continue;

        const { channelName, channelURL, channelVideos } = youtube.getContent(channel, 1);
        const { shortUrl } = channelVideos[0];
        const message = `[${channelName}](<${channelURL}>) has posted a new video.\n${shortUrl}`;

        const saved = props.getProperty(channelName);
        if (saved && saved === shortUrl) return;
        youtube.discord(webhook, message, mention);
        props.setProperty(channelName, shortUrl);
    }
}

function testing() { props.deleteAllProperties(); const triggers = ScriptApp.getProjectTriggers(); for (const trigger of triggers) { try { ScriptApp.deleteTrigger(trigger) } catch (e) { }; Utilities.sleep(1000) } ScriptApp.newTrigger("send2Discord").timeBased().everyMinutes(5).create(); send2Discord() }
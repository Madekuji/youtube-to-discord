const props = PropertiesService.getScriptProperties();
const webhook = `
  Please remove this text and paste your webhook URLs here. It doesn't matter if you leave blank lines.
`
function send2Discord() {
  const { channelName, channelURL, channelVideos } = youtube.getContent('PASTE_YOUTUBE_CHANNEL_ID_HERE', 1);
  const { shortUrl } = channelVideos[0];
  const message = `[${channelName}](<${channelURL}>) has posted a new video.\n${shortUrl}`;
  const mention = "";

  const saved = props.getProperty(channelName);
  if (saved && saved === shortUrl) return;
  youtube.discord(webhook, message, mention);
  props.setProperty(channelName, shortUrl);
}

function testing() {
  props.deleteAllProperties();
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    try { ScriptApp.deleteTrigger(trigger); } catch (e) { };
    Utilities.sleep(1000);
  }
  ScriptApp.newTrigger("send2Discord").timeBased().everyMinutes(5).create();
  send2Discord()
}
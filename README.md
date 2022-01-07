# YouTube to Discord for Google Apps Script

This repository outlines everything shown in in [this video](https://youtu.be/iAuCrbEFCfg); I recommend watching that for something easier.

This script will allow you to send your latest YouTube Upload into your Discord server, automatically.

# Use

Click on Libraries and paste in `12ig-WOMIoZS-dCdgfhsT17QM-idEg3CPhYjtD2CYgBZR2GYIPBxZ2PPm` (the project key for this script), Press `Look Up`.

Select `version 3` (most recent) and change the identifer from `basicyoutube` to `youtube` and press Add.

Now you can paste this code into your blank `Code.gs` file.

```javascript
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
```

I highly recommend running the function; `testing()` so it creates the trigger automatically.

Anyways, that's it - the script will now check every 5 minutes for a new video, if it finds one - it'll send to your Discord server.

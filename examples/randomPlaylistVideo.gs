let webhook = `
  Paste webhooks here (make sure they're on seperate lines, if you're adding multiple.) Also, remove all this text...
`,
ytPlaylists = `
  Paste your YouTube playlist IDs here (make sure they're on seperate lines, if you're adding multiple.)
  Also, remove this all text...
`
mention = ``;


const props = PropertiesService.getScriptProperties();
function send2Discord() {
    ytPlaylists = ytPlaylists.split('\n');
    for (let playlist of ytPlaylists) {
        playlist = playlist.trim();
        if (playlist == '') continue;

        const {videos} = youtube.playlist(playlist);
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const {title, url} = randomVideo;
        const message = `${title}\n${url}`;

        youtube.discord(webhook, message, mention);
    }
}

function testing() { props.deleteAllProperties(); const triggers = ScriptApp.getProjectTriggers(); for (const trigger of triggers) { try { ScriptApp.deleteTrigger(trigger) } catch (e) { }; Utilities.sleep(1000) } ScriptApp.newTrigger("send2Discord").timeBased().everyMinutes(5).create(); send2Discord() }
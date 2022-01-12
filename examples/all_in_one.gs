let webhook = `
  Paste webhooks here (make sure they're on seperate lines, if you're adding multiple.) Also, remove all this text...
`,
ytChannels = `
  Paste your YouTube channel IDs here (make sure they're on seperate lines, if you're adding multiple.)
  Your YouTube Channel ID will ALWAYS start with UC.
  Also, remove this all text...
`,
ytPlaylists = `
  Paste your YouTube playlist IDs here (make sure they're on seperate lines, if you're adding multiple.)
  Also, remove this all text...
`,
mention = ``,

option = `latest`;


const props = PropertiesService.getScriptProperties();

function send2Discord() {
    let data, message;
    if (!option) throw Error('Option must be either "latest" or "playlist"');
    
    if (option == 'latest') {
        data = fetchLatest(1);
        message = `[${data.channelName}](<${data.channelURL}>) has posted a new video.\n${data.url}`;
    };

    if (option == 'playlist') {
        data = fetchPlaylist();
        message = `${data.title}\n${data.url}`;
    };

    youtube.discord(webhook, message, mention);

}

function fetchLatest(num) {
    if (!num) num = 1;
    ytChannels = ytChannels.split('\n');
    for (let channel of ytChannels) {
        channel = channel.trim();
        if (channel == '') continue;

        const { channelName, channelURL, channelVideos } = youtube.getContent(channel, 1);
        const { shortUrl } = channelVideos[0];

        const saved = props.getProperty(channelName);
        if (saved && saved === shortUrl) return;
        props.setProperty(channelName, shortUrl);
        
        return {"channelName": channelName, "channelURL": channelURL, "url": shortUrl}
    }
}

function fetchPlaylist() {
    ytPlaylists = ytPlaylists.split('\n');
    for (let playlist of ytPlaylists) {
        playlist = playlist.trim();
        if (playlist == '') continue;

        const {videos} = youtube.playlist(playlist);
        const randomVideo = videos[Math.floor(Math.random() * videos.length)];
        const {title, url} = randomVideo;
        
        return {"title": title, "url": url}
    }
}

function testing() {
    props.deleteAllProperties();
    const triggers = ScriptApp.getProjectTriggers();
    for (const trigger of triggers) {
        try { ScriptApp.deleteTrigger(trigger) } catch (e) {};
        Utilities.sleep(1000)
    }
    ScriptApp.newTrigger("send2Discord").timeBased().everyMinutes(5).create();
    option = 'latest'
    send2Discord()
}
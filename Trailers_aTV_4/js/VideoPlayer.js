// Simple Video Player

var videoPlayer = {
    
    play: function(url) {

        var mediaItem = new MediaItem("video", url);
        var player = new Player();
        var playlist = new Playlist();
        
        player.playlist = playlist;
        player.playlist.push(mediaItem);
        player.present();
    }
}
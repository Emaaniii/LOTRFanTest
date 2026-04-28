Drop your audio file here as `may-it-be.mp3`.

Why a manual file?
  Enya's "May It Be" is copyrighted, so the source MP3 isn't bundled with
  the project. Acquire the track legally (your own purchase, a CD rip from
  music you already own, etc.) and save it at:

    public/music/may-it-be.mp3

The MusicPlayer component (app/components/MusicPlayer.js) already references
that path — once the file is in place, music will start playing on your
first click anywhere on the page.

Supported formats: .mp3, .ogg, .m4a — change the `<audio src>` extension in
MusicPlayer.js if you use something other than .mp3.

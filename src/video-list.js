const fs = require('fs');
const path = require('path');

// Se guardan los videos aca de la carpeta media
let allVideos = [];

// conseguimos Path de la carpeta donde se encuentra media
const mediaPath = path.dirname(__dirname);

console.log(mediaPath)

// leemos todos los archivos de la carpeta media y los agregamos al array de allVideos
fs.readdirSync(`${mediaPath}/views/media`)
  .filter((file) => file.includes('mp4'))
  .map((file) => {
    let name = file.split('.')[0];
    allVideos.push({
      name: name,
      src: name,
      id: 'vid_' + (allVideos.length + 1),
      time: 0,
    });
  });

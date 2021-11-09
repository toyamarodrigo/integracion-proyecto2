const fs = require('fs');
const path = require('path');
const JSON_FILE = path.join(__dirname, '../uploads/file.json');
var interval;
var videoName;

// Función para chequear si el video esta en el archivo
const getVideoOnFile = (videoName, file) => {
  return file.map((video) => video.name).includes(videoName);
};

// Función para conseguir el tiempo en el que se esta reproduciendo el archivo cada segundo
const getTime = () => {
  let video = document.getElementById('myvideo');
  video.play();

  interval = setInterval(
    (video) => {
      console.log(video.currentTime);
    },
    1000,
    video
  );
};

// Función para obtener el tiempo en el que se instancia la función
const getVideoCurrentTime = () => {
  let video = document.getElementById('myvideo');
  return video.currentTime;
};

// Función para parar el intervalo de tiempo y prepara el guardado del archivo
const stopInterval = () => {
  clearInterval(interval);
  saveVideoOnFile();
};

// Función para guardar el video en el archivo
const saveVideoOnFile = () => {
  // Leemos archivo JSON
  const file = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));

  // Chequear si existe el video en el archivo uploads/file.json
  const isVideoOnFile = getVideoOnFile(videoName, file);

  // Si existe el video en el archivo guardar el tiempo en el que estaba el video y play
  if (isVideoOnFile) {
    const filterVideo = file.map((video) => {
      if (video.name === videoName) {
        return {
          ...video,
          time: getVideoCurrentTime(),
        };
      }

      return video;
    });

    fs.writeFile(JSON_FILE, JSON.stringify(filterVideo), (err) => {
      if (err) throw err;
      console.log('The existing video time has been modified!');
    });
  } else {
    // Sino existe el video en el archivo, 
    // guardar el video nuevo en el archivo
    fs.writeFile(
      JSON_FILE,
      JSON.stringify([
        ...file,
        { name: videoName, time: getVideoCurrentTime() },
      ]),
      (err) => {
        if (err) throw err;
        console.log('The video has been saved!');
      }
    );
  }
};

// Escuchamos el evento "onChange" del input y leemos el archivo que se le carga
document.getElementById('videoInput').addEventListener('change', function (e) {
  let file = e.target.files[0];

  // Obtenemos el nombre del archivo
  videoName = file.name;
  let reader = new FileReader();

  // Leemos el archivo
  reader.onload = function (e) {
    let video = document.getElementById('myvideo');

    // le cargamos el video
    video.src = e.target.result;

    // Leemos el archivo JSON y chqueeamos si existe el video
    const file = JSON.parse(fs.readFileSync(JSON_FILE, 'utf8'));
    const isVideoOnFile = getVideoOnFile(videoName, file);

    // Si existe el video en el archivo, reproducimos en el tiempo que se encontraba
    if (isVideoOnFile) {
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = file.filter(
          (video) => video.name === videoName
        )[0].time;
      });
      video.play();
    } else {
      // Sino se reproduce desde el principio
      video.play();
    }
  };
  reader.readAsDataURL(file);
});

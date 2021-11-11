// Seleccionamos todos los tags del DOM
const mainVideo = document.querySelector('#main-Video');
const playlist = document.getElementById('playlist');
const AllClases = document.querySelector('.AllClases');
const ulTag = document.querySelector('ul');

var interval;

//Obtenemos cantidad de clases para mostrarlas en el html
AllClases.innerHTML = `${allVideos.length} Clases`;

// Lo primero que hago es cargar todos los videos de la carpeta media al localStorage
getVideosOnLocalStorage();

let videoIndex = 1;
window.addEventListener('load', () => {
  loadVideo(videoIndex);
  // Agarra el tiempo del video todo el tiempo cada 1seg y lo guardo en localStorage
  interval = setInterval(
    (mainVideo) => {
      const videos = JSON.parse(localStorage.getItem('videos'));
      const filterVideo = videos.map((video) => {
        if (video.src === allVideos[videoIndex - 1].src) {
          return {
            ...video,
            time: mainVideo.currentTime,
          };
        }
        return video;
      });
      localStorage.setItem('videos', JSON.stringify([...filterVideo]));
    },
    1000,
    mainVideo
  );
  playingNow();
});

//Obtener el src del video a reproducir
function loadVideo(indexNumb) {
  mainVideo.src = `./media/${allVideos[indexNumb - 1].src}.mp4`;
}

//Comienza a reproducir video y agrega clase "active" para estilos css
function playVideo() {
  mainVideo.play();
  playlist.classList.add('active');
}


mainVideo.addEventListener('loadedmetadata', () => {
  // Cuando el video cambia, agarro del localStorage los videos
  const getVideos = JSON.parse(localStorage.getItem('videos'));
  // Pregunto si existe, si existe le asigno el tiempo que tenia guardado, sino tiempo 0
  const videoExist = getVideos.map((video) => video.src).includes(allVideos[videoIndex - 1].src);
  // Deja el video con el tiempo que estaba guardado
  mainVideo.currentTime = videoExist ? getVideos[videoIndex - 1].time : 0;
})

// Crea la estructura HTML de la playlist de videos
for (let i = 0; i < allVideos.length; i++) {
  let liTag = `<li li-index="${i + 1}">
      <div class="row">
         <span>${i + 1}. ${allVideos[i].name}</span>
      </div>
      <video class="${allVideos[i].id}" src="media/${
    allVideos[i].src
  }.mp4" style="display: none;" title="${allVideos[i].name}"></video>
      <span id="${allVideos[i].id}" class="duration"></span>
   </li>`;
  playlist.insertAdjacentHTML('beforeend', liTag);

  let liDuracionVideo = ulTag.querySelector(`#${allVideos[i].id}`);
  let liVideoTag = ulTag.querySelector(`.${allVideos[i].id}`);

  liVideoTag.addEventListener('loadeddata', () => {
    let duracionVideo = liVideoTag.duration;
    let totalMin = Math.floor(duracionVideo / 60);
    let totalSeg = Math.floor(duracionVideo % 60);
    totalSeg < 10 ? (totalSeg = '0' + totalSeg) : totalSeg;
    liDuracionVideo.innerText = `${totalMin}:${totalSeg}`;
    // Agrego la duracion total del video al HTML
    liDuracionVideo.setAttribute('t-duration', `${totalMin}:${totalSeg}`);
  });
}



const allLiTags = playlist.querySelectorAll('li');

function playingNow() {
  //Recorriendo los videos agregando y sacando la clase playing
  for (let j = 0; j < allVideos.length; j++) {
    if (allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing');
    }
    if (allLiTags[j].getAttribute('li-index') == videoIndex) {
      allLiTags[j].classList.add('playing');
    }
    //Agregando atributo onclick
    allLiTags[j].setAttribute('onclick', 'clicked(this)');
  }
}

function clicked(element) {
  //Obteniendo el index del elemento li clickeado
  let getIndex = element.getAttribute('li-index');
  videoIndex = getIndex;
  //Cargando y ejecutando las funciones playVideo y playingNow
  loadVideo(videoIndex);
  playVideo();
  playingNow();
}

function getVideosOnLocalStorage() {
  if (!localStorage.getItem('videos') || localStorage.getItem('videos') == '[]') {
    localStorage.setItem('videos', JSON.stringify(allVideos));
  } else {
    const getVideos = JSON.parse(localStorage.getItem('videos'));
    let newArr = allVideos.filter((video) => !getVideos.some((video2) => video2.src === video.src))
    if(newArr.length) {
      return localStorage.setItem('videos', JSON.stringify([...getVideos, ...newArr]));
    } else {
      localStorage.setItem('videos', JSON.stringify([...getVideos]));
    }
  }
}
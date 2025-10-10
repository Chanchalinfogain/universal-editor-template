const video = document.createElement('video');

video.muted = true; 

video.toggleAttribute('autoplay', true);
video.toggleAttribute('loop', true);
video.toggleAttribute('playsinline', true);
const source = document.createElement('source');
source.setAttribute('src', entry[2]);
source.setAttribute('type', 'video/mp4');
video.append(source);
slide.append(video);

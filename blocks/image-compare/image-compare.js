export default function decorate(block) {
  const images = block.querySelectorAll('img');
  if (images.length !== 2) {
    return;
  }

  const [leftImage, rightImage] = images;

  // Create the container structure
  const leftDiv = document.createElement('div');
  leftDiv.className = 'image-compare-left';
  leftDiv.appendChild(leftImage);

  const sliderDiv = document.createElement('div');
  sliderDiv.className = 'image-compare-slider';

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = '0';
  slider.max = '100';
  slider.value = '50';
  slider.className = 'image-compare-range';

  sliderDiv.appendChild(slider);

  // Clear the block and rebuild
  block.innerHTML = '';
  block.appendChild(rightImage);
  block.appendChild(leftDiv);
  block.appendChild(sliderDiv);

  // Add event listener for slider
  slider.addEventListener('input', (e) => {
    const { value } = e.target;
    leftDiv.style.width = `${value}%`;
  });
}

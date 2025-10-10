export default function decorate(block) {
  const rows = [...block.children];
  
  // First row should contain the background image
  if (rows.length > 0) {
    const firstRow = rows[0];
    const backgroundImg = firstRow.querySelector('img');
    
    if (backgroundImg) {
      // Keep the background image in the block
      block.innerHTML = '';
      block.appendChild(backgroundImg);
    }
  }

  // Process hotspot items (rows after the first one)
  rows.forEach((row, r) => {
    if (r > 0) {
      const cells = [...row.children];
      if (cells.length >= 3) {
        const content = cells[0].textContent.trim();
        const leftPos = cells[1].textContent.trim();
        const topPos = cells[2].textContent.trim();
        
        const variant = block.classList.value;
        const isImageVariant = variant.includes('image') && !(variant.includes('video'));
        const isVideoVariant = variant.includes('video') && !(variant.includes('image'));
        const isTextVariant = !isImageVariant && !isVideoVariant;

        const hotspotDiv = document.createElement('div');
        hotspotDiv.classList.add('hotspot');
        hotspotDiv.style.left = leftPos.endsWith('%') ? leftPos : `${leftPos}%`;
        hotspotDiv.style.top = topPos.endsWith('%') ? topPos : `${topPos}%`;
        hotspotDiv.setAttribute('data-content', content);

        // Create content display element
        const contentContainer = document.createElement('div');
        contentContainer.classList.add('hotspot-content');

        if (isImageVariant) {
          const img = document.createElement('img');
          img.src = content;
          contentContainer.appendChild(img);
        } else if (isVideoVariant) {
          const video = document.createElement('div');
          const allowedVideoDomains = ['youtube.com', 'vimeo.com', 'sidekick-library--aem-block-collection--adobe'];
          try {
            const url = new URL(content);
            const domainCheck = (domain) => url.hostname.includes(domain);
            const isTrustedDomain = allowedVideoDomains.some(domainCheck);
            if (isTrustedDomain) {
              const div = document.createElement('div');
              div.className = 'embed-default';

              const iframe = document.createElement('iframe');
              iframe.src = url.href;
              iframe.setAttribute('allow', 'encrypted-media');
              iframe.setAttribute('loading', 'lazy');

              div.appendChild(iframe);
              video.appendChild(div);
            } else {
              video.textContent = 'This video source is not allowed.';
              contentContainer.classList.add('bgborder');
            }
          } catch (e) {
            video.textContent = 'Invalid video URL.';
            contentContainer.classList.add('bgborder');
          }
          contentContainer.appendChild(video);
        } else if (isTextVariant) {
          contentContainer.textContent = content;
          contentContainer.classList.add('bgborder');
        }

        // Append content container to hotspot div
        hotspotDiv.appendChild(contentContainer);
        hotspotDiv.addEventListener('click', () => {
          // Hide content of all other hotspots
          document.querySelectorAll('.hotspot').forEach((hotspot) => {
            if (hotspot !== hotspotDiv) {
              hotspot.classList.remove('onclick');
            }
          });
          // Toggle the current hotspot content
          hotspotDiv.classList.toggle('onclick');
        });

        // Add hotspot to the block
        block.appendChild(hotspotDiv);
      }
    }
  });
}

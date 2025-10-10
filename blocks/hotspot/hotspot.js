export default function decorate(block) {
  const rows = [...block.children];
  
  if (rows.length === 0) return;

  // Process each row as a hotspot item
  rows.forEach((row, index) => {
    const cells = [...row.children];
    
    if (index === 0) {
      // First row contains the background image
      const img = row.querySelector('img');
      if (img) {
        img.style.width = '100%';
        img.style.height = 'auto';
      }
    } else if (cells.length >= 3) {
      // Subsequent rows contain hotspot data: content, left%, top%
      const content = cells[0].innerHTML.trim();
      const leftPos = cells[1].textContent.trim();
      const topPos = cells[2].textContent.trim();
      
      // Create hotspot marker
      const hotspotMarker = document.createElement('div');
      hotspotMarker.classList.add('hotspot');
      hotspotMarker.style.left = leftPos.includes('%') ? leftPos : `${leftPos}%`;
      hotspotMarker.style.top = topPos.includes('%') ? topPos : `${topPos}%`;
      
      // Create content container
      const contentContainer = document.createElement('div');
      contentContainer.classList.add('hotspot-content');
      contentContainer.innerHTML = content;
      
      // Add click functionality
      hotspotMarker.appendChild(contentContainer);
      hotspotMarker.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Hide other hotspots
        block.querySelectorAll('.hotspot').forEach((hotspot) => {
          if (hotspot !== hotspotMarker) {
            hotspot.classList.remove('onclick');
          }
        });
        
        // Toggle current hotspot
        hotspotMarker.classList.toggle('onclick');
      });
      
      // Add hotspot to block
      block.appendChild(hotspotMarker);
      
      // Remove the original row since we've processed it
      row.style.display = 'none';
    }
  });

  // Close hotspots when clicking outside
  document.addEventListener('click', (e) => {
    if (!block.contains(e.target)) {
      block.querySelectorAll('.hotspot').forEach((hotspot) => {
        hotspot.classList.remove('onclick');
      });
    }
  });
}

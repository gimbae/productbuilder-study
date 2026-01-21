function createPepperoniSVG() {
  const size = 200;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 5; 

  // Main slice
  let svgContent = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#D32F2F" stroke="#B71C1C" stroke-width="4"/>`;

  // Add some random "fat" spots
  const numSpots = 6 + Math.floor(Math.random() * 6); 
  for (let i = 0; i < numSpots; i++) {
    const angle = Math.random() * 2 * Math.PI;
    // Distribute spots, keeping them somewhat away from the very edge
    const dist = Math.random() * (r - 25); 
    const spotX = cx + dist * Math.cos(angle);
    const spotY = cy + dist * Math.sin(angle);
    const spotR = 4 + Math.random() * 8; 

    svgContent += `<circle cx="${spotX}" cy="${spotY}" r="${spotR}" fill="#FFCDD2" opacity="0.6" />`;
  }
  
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", size);
  svg.setAttribute("height", size);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  // Add class for styling
  svg.setAttribute("class", "pep-img");
  svg.innerHTML = svgContent;
  
  return svg;
}

function togglePepperoni() {
  const wrap = document.getElementById('pepperoni-wrap');
  
  // If empty, generate 3 images
  if (wrap.children.length === 0) {
    for (let i = 0; i < 3; i++) {
      wrap.appendChild(createPepperoniSVG());
    }
  }

  wrap.style.display =
    wrap.style.display === 'none' || wrap.style.display === ''
      ? 'flex'
      : 'none';
}

const svgNS = "http://www.w3.org/2000/svg";
const radius = 180;
const pieGroup = document.getElementById("pie");
const input = document.getElementById("sliceInput");
const button = document.getElementById("drawBtn");
const residueSetDisplay = document.getElementById("residueSet");

const highlightPos = document.getElementById("highlightPos");
const highlightNeg = document.getElementById("highlightNeg");
const clearHighlight = document.getElementById("clearHighlight");

let currentN = 5;

function drawSlices(n) {
  currentN = n;
  while (pieGroup.firstChild) pieGroup.removeChild(pieGroup.firstChild);

  const angleOffset = -Math.PI / 2;
  const residues = Array.from({ length: n }, (_, i) => i);
  residueSetDisplay.innerHTML = `<b>ℤ/${n}ℤ</b> = { ${residues.join(", ")} }`;

  for (let i = 0; i < n; i++) {
    const startAngle = ((i * 2 * Math.PI) / n) + angleOffset;
    const endAngle = (((i + 1) * 2 * Math.PI) / n) + angleOffset;
    const midAngle = (startAngle + endAngle) / 2;

    const x1 = radius * Math.cos(startAngle);
    const y1 = radius * Math.sin(startAngle);
    const x2 = radius * Math.cos(endAngle);
    const y2 = radius * Math.sin(endAngle);
    const largeArc = (endAngle - startAngle) > Math.PI ? 1 : 0;

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', `M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`);
    path.setAttribute('fill', '#e0d8c3');
    pieGroup.appendChild(path);

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', 0);
    line.setAttribute('y1', 0);
    line.setAttribute('x2', x1.toFixed(2));
    line.setAttribute('y2', y1.toFixed(2));
    line.setAttribute('stroke', '#111');
    line.setAttribute('stroke-width', '1');
    pieGroup.appendChild(line);

    const labelRadius = radius + 15;
    const lx = labelRadius * Math.cos(midAngle);
    const ly = labelRadius * Math.sin(midAngle);
    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', lx.toFixed(2));
    label.setAttribute('y', ly.toFixed(2));
    label.textContent = i.toString();
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('dominant-baseline', 'middle');
    label.setAttribute('font-size', '14');
    label.setAttribute('fill', '#111');
    pieGroup.appendChild(label);
  }

  const finalAngle = ((n * 2 * Math.PI) / n) + angleOffset;
  const fx = radius * Math.cos(finalAngle);
  const fy = radius * Math.sin(finalAngle);
  const finalLine = document.createElementNS(svgNS, 'line');
  finalLine.setAttribute('x1', 0);
  finalLine.setAttribute('y1', 0);
  finalLine.setAttribute('x2', fx.toFixed(2));
  finalLine.setAttribute('y2', fy.toFixed(2));
  finalLine.setAttribute('stroke', '#111');
  finalLine.setAttribute('stroke-width', '1');
  pieGroup.appendChild(finalLine);

  const maxSteps = 50;
  const radialSpacing = 14;
  const lateralOffset = 10;
  const spiralEnds = new Map();

  for (let direction of [-1, 1]) {
    for (let k = 1; k <= maxSteps; k++) {
      const actualK = k * direction;
      const residue = ((actualK % n) + n) % n;
      const rotation = Math.floor(k / n);

      const angle = ((residue * 2 * Math.PI) / n) + angleOffset;
      const radialDistance = radius - 30 - rotation * radialSpacing;

      if (radialDistance < 40) break;

      const baseX = radialDistance * Math.cos(angle);
      const baseY = radialDistance * Math.sin(angle);
      const offsetX = lateralOffset * Math.cos(angle + Math.PI / 2) * direction;
      const offsetY = lateralOffset * Math.sin(angle + Math.PI / 2) * direction;
      const finalX = baseX + offsetX;
      const finalY = baseY + offsetY;

      const stepLabel = document.createElementNS(svgNS, 'text');
      stepLabel.setAttribute('x', finalX.toFixed(2));
      stepLabel.setAttribute('y', finalY.toFixed(2));
      stepLabel.textContent = actualK > 0 ? `+${actualK}` : `${actualK}`;
      stepLabel.setAttribute('data-sign', direction > 0 ? 'pos' : 'neg');
      stepLabel.setAttribute('text-anchor', 'middle');
      stepLabel.setAttribute('dominant-baseline', 'middle');
      stepLabel.setAttribute('font-size', '10');
      stepLabel.setAttribute('fill', '#333');
      pieGroup.appendChild(stepLabel);

      spiralEnds.set(`${residue},${direction}`, {
        angle,
        direction,
        distance: radialDistance
      });
    }
  }

  for (let [key, { angle, direction, distance }] of spiralEnds.entries()) {
    const ellipsisDistance = distance - 12;
    const baseX = ellipsisDistance * Math.cos(angle);
    const baseY = ellipsisDistance * Math.sin(angle);
    const offsetX = lateralOffset * Math.cos(angle + Math.PI / 2) * direction;
    const offsetY = lateralOffset * Math.sin(angle + Math.PI / 2) * direction;
    const finalX = baseX + offsetX;
    const finalY = baseY + offsetY;

    const dot = document.createElementNS(svgNS, 'text');
    dot.setAttribute('x', finalX.toFixed(2));
    dot.setAttribute('y', finalY.toFixed(2));
    dot.textContent = '…';
    dot.setAttribute('text-anchor', 'middle');
    dot.setAttribute('dominant-baseline', 'middle');
    dot.setAttribute('font-size', '14');
    dot.setAttribute('fill', '#555');
    pieGroup.appendChild(dot);
  }
}

drawSlices(parseInt(input.value));

button.addEventListener('click', () => {
  let value = parseInt(input.value);
  if (isNaN(value) || value < 2) {
    value = 2;
    input.value = "2";
  }
  drawSlices(value);
});

highlightPos.addEventListener('click', () => {
  document.querySelectorAll('[data-sign]').forEach(el => {
    el.setAttribute('font-weight', el.getAttribute('data-sign') === 'pos' ? 'bold' : 'normal');
  });
});

highlightNeg.addEventListener('click', () => {
  document.querySelectorAll('[data-sign]').forEach(el => {
    el.setAttribute('font-weight', el.getAttribute('data-sign') === 'neg' ? 'bold' : 'normal');
  });
});

clearHighlight.addEventListener('click', () => {
  document.querySelectorAll('[data-sign]').forEach(el => {
    el.setAttribute('font-weight', 'normal');
  });
});

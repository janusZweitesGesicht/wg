// dragonFractal.js
document.addEventListener('DOMContentLoaded', function () {
	const svg = document.getElementById('fractalTree');
	let branchCounter = 0;
	const delayBetweenBranches = 5;

	function resetDragon() {
		svg.innerHTML = '';
		branchCounter = 0;
	}

	function drawDragon(x1, y1, x2, y2, depth, sign = 1) {
		if (depth === 0) {
			setTimeout(() => {
				const line = document.createElementNS(
					'http://www.w3.org/2000/svg',
					'line'
				);
				line.setAttribute('x1', x1);
				line.setAttribute('y1', y1);
				line.setAttribute('x2', x2);
				line.setAttribute('y2', y2);

				const hue = 200 + depth * 5;
				line.setAttribute('stroke', `hsl(${hue}, 70%, 50%)`);
				line.setAttribute('stroke-width', 1.5);
				line.setAttribute('stroke-linecap', 'round');

				const lengthLine = Math.hypot(x2 - x1, y2 - y1);
				line.setAttribute('stroke-dasharray', lengthLine);
				line.setAttribute('stroke-dashoffset', lengthLine);
				svg.appendChild(line);

				line.animate(
					[{ strokeDashoffset: lengthLine }, { strokeDashoffset: 0 }],
					{
						duration: 500,
						fill: 'forwards'
					}
				);
			}, branchCounter * delayBetweenBranches);
			branchCounter++;
			return;
		}

		const xn = (x1 + x2) / 2 + (sign * (y2 - y1)) / 2;
		const yn = (y1 + y2) / 2 - (sign * (x2 - x1)) / 2;

		drawDragon(x1, y1, xn, yn, depth - 1, 1);
		drawDragon(xn, yn, x2, y2, depth - 1, -1);
	}

	// Автоматическое определение размеров SVG
	function initDragon() {
		resetDragon();
		const svgRect = svg.getBoundingClientRect();
		svg.setAttribute('width', svgRect.width);
		svg.setAttribute('height', svgRect.height);

		const centerX = svgRect.width / 2;
		const centerY = svgRect.height / 2;
		const length = Math.min(svgRect.width, svgRect.height) * 1.5;

		drawDragon(
			centerX + 60 - length / 2,
			centerY + 35,
			centerX + 60 + length / 2,
			centerY + 35,
			12 // глубина рекурсии
		);
	}

	initDragon();
});

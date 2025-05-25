//--- ф-ция svg-дерева
document.addEventListener('DOMContentLoaded', function () {
	const svg = document.getElementById('fractalTree');
	let branchCounter = 0;
	const delayBetweenBranches = 7; //* скорость

	function getBranchColor(color) {
		//ф-ция цвета
		const hue = 199; //цвет
		const saturation = 70; // насыщенность 70%
		const lightness = 50; // светлота 50%
		return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
	}

	function drawBranch(x1, y1, angle, length, depth, color) {
		if (depth === 0) return;

		const x2 = x1 + Math.cos(angle) * length;
		const y2 = y1 + Math.sin(angle) * length;

		setTimeout(() => {
			const line = document.createElementNS(
				'http://www.w3.org/2000/svg',
				'line'
			);
			line.setAttribute('x1', x1);
			line.setAttribute('y1', y1);
			line.setAttribute('x2', x2);
			line.setAttribute('y2', y2);

			const branchColor = getBranchColor(depth);
			line.setAttribute('stroke', branchColor);
			//line.setAttribute('stroke', `hsl(${depth * 3}, 70%, 30%)`); //раньше был цвет, теперь он в fn
			line.setAttribute('stroke-width', depth * 1.4); //* ширина
			line.setAttribute('stroke-linecap', 'round');

			//рост линии
			const lengthLine = Math.hypot(x2 - x1, y2 - y1);
			line.setAttribute('stroke-dasharray', lengthLine);
			line.setAttribute('stroke-dashoffset', lengthLine);
			svg.appendChild(line);

			line.animate(
				[{ strokeDashoffset: lengthLine }, { strokeDashoffset: 0 }],
				{
					duration: 300,
					fill: 'forwards'
				}
			);
		}, branchCounter * delayBetweenBranches);

		branchCounter++;

		drawBranch(x2, y2, angle - Math.PI / 6, length * 0.7, depth - 1, color);
		drawBranch(x2, y2, angle + Math.PI / 6, length * 0.7, depth - 1, color);
	}

	drawBranch(1100, 600, -Math.PI / 2, 150, 9, [208, 75, 46]);
	drawBranch(210, 600, -Math.PI / 2, 100, 9, [208, 75, 46]);
	// drawBranch(510, -140, Math.PI / 2, 100, 9);
	// drawBranch(-20, -90, 290, 100, 9);
	// drawBranch(-10, 600, -Math.PI / 2, 190, 9);
});

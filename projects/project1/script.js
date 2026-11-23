// SCHRIFT
let font;
let fontPath = "Bungee-Regular.ttf";
let fontSize = 350;

// TEXT
let word = "STAY"; // Wort aus Blättern
let points; // Zielpunkte der Blätter
let grassWord = "FALL"; // Wort im Gras
let grassPoints; // Punkte der Grashalme

// HINTERGRUND -> LANDSCHAFT
let ground = 350; // wo der Boden beginnt

// BÄUME
let trunkX = [100, 200, 400, 800, 950];
let trunkY = [200, 250, 150, 200, 150];
let trunkH = [300, 350, 250, 350, 250];
let thickness = [40, 50, 30, 40, 30];

// ÄSTE
let branch1 = [];
let branch2 = [];
let branch3 = [];
let branch4 = [];
let tipX = [];
let tipY = [];

// BLÄTTER
let palette = ["#E8B03A", "#E8B03A", "#D9772B", "#D9772B", "#B8432B", "#B8432B", "#7A3B2A", "#7A3B2A"];
let palette2 = ["#A8551F", "#87301F", "#552A1E"];
let leafX = []; // aktuelle Position
let leafY = [];
let leafColor = [];
let leafAngle = [];
let falling = []; // fällt das Blatt schon?

let leafPileX = [0, 400, 100, 765, 960, 400, 1200];
let leafPileY = [650, 450, 510, 545, 400, 800, 480];
let randomLeafX = [20, 950, 680, 280];
let randomLeafY = [400, 500, 450, 500];
let pileLeafX = [];
let pileLeafY = [];
let pileColor = [];

async function setup() {
	randomSeed(4);
	noiseSeed(4);
	createCanvas(1200, 800);
	textAlign(RIGHT, BOTTOM)
	textSize(fontSize);
	textStyle(BOLD)

	font = await loadFont(fontPath);

	points = font.textToPoints(word, width - 270, height - 50, {
		sampleFactor: 0.2,
	});

	grassPoints = font.textToPoints(grassWord, width - 210, height - 50, {
		sampleFactor: 0.08,
	});

	for (let i = 0; i < points.length; i++) {
		points[i].y = height - ((height - points[i].y) * 0.5);
		points[i].x += (height - points[i].y)
	}

	for (let i = 0; i < grassPoints.length; i++) {
		grassPoints[i].y = height - ((height - grassPoints[i].y) * 0.5);
		grassPoints[i].x += (height - grassPoints[i].y)
	}

	for (let i = 0; i < trunkX.length; i++) {
		branch1.push(random(0.7, 1.3));
		branch2.push(random(0.7, 1.3));
		branch3.push(random(0.7, 1.3));
		branch4.push(random(0.7, 1.3));

		let cx = trunkX[i] + thickness[i] / 2;
		tipX.push(cx + 80 * branch1[i]);
		tipY.push(trunkY[i] - 70 * branch1[i]);

		tipX.push(cx - 70 * branch2[i]);
		tipY.push(trunkY[i] + 60 * branch2[i]);

		tipX.push(cx - 80 * branch3[i]);
		tipY.push(trunkY[i] - 70 * branch3[i]);

		tipX.push(cx + 70 * branch4[i]);
		tipY.push(trunkY[i] + 60 * branch4[i]);
	}

	for (let i = 0; i < points.length; i++) {
		let k = floor(random(tipX.length));
		let x = tipX[k] + random(-30, 30);
		let y = tipY[k] + random(-30, 30);
		leafX.push(x);
		leafY.push(y);
		leafColor.push(random(palette));
		falling.push(false);
		leafAngle.push(random(TWO_PI));
	}

	for (let i = 0; i < 180; i++) {
		let j = floor(random(leafPileX.length));
		let x = leafPileX[j] + random(-60, 60);
		let y = leafPileY[j] + random(-15, 10);
		pileLeafX.push(x);
		pileLeafY.push(y);
		pileColor.push(random(palette2));
	}

	for (let i = 0; i < 10; i++) {
		let j = floor(random(randomLeafX.length));
		let x = randomLeafX[j] + random(-30, 30);
		let y = randomLeafY[j] + random(-15, 5);
		pileLeafX.push(x);
		pileLeafY.push(y);
		pileColor.push(random(palette2));
	}
}

function draw() {
	background(220);

	fill(0, 0, 200, 50);
	rect(0, 0, width, height);

	fill(78, 75, 55);
	beginShape();
	for (let x = 0; x <= width; x += 20) {
		let y = ground + noise(x * 0.003) * 60;
		vertex(x, y);
	}
	vertex(width, height);
	vertex(0, height);
	endShape(CLOSE);

	let fallen = 0;

	for (let i = 0; i < leafX.length; i++) {
		if (falling[i]) {
			fallen++;
		}
	}

	let alpha = map(fallen, 0, leafX.length, 255, 0);

	if (frameCount % 60 === 0) {
		console.log(fallen);
	}

	stroke(110, 105, 70, alpha);
	strokeWeight(3);
	for (let i = 0; i < grassPoints.length; i++) {
		line(grassPoints[i].x, grassPoints[i].y, grassPoints[i].x + sin(i) * 3, grassPoints[i].y - (12 + sin(i * 2.3) * 4));
	}
	noStroke();

	for (let i = 0; i < trunkX.length; i++) {
		let cx = trunkX[i] + thickness[i] / 2;
		fill(61, 51, 44);
		noStroke();
		quad(trunkX[i], trunkY[i] + trunkH[i], trunkX[i] + thickness[i], trunkY[i] + trunkH[i], cx + thickness[i] / 5, trunkY[i], cx - thickness[i] / 5, trunkY[i])
		stroke(61, 51, 44);
		branch(cx, trunkY[i] + 20, cx + 80 * branch1[i], trunkY[i] - 70 * branch1[i], thickness[i] / 2);
		branch(cx, trunkY[i] + 80, cx - 70 * branch2[i], trunkY[i] + 60 * branch2[i], thickness[i] / 2);
		branch(cx, trunkY[i] + 20, cx - 80 * branch3[i], trunkY[i] - 70 * branch3[i], thickness[i] / 2);
		branch(cx, trunkY[i] + 80, cx + 70 * branch4[i], trunkY[i] + 60 * branch4[i], thickness[i] / 2);
		noStroke();
	}

	if (random(1) < 0.005) {
		let randomLeaf = floor(random(leafX.length));
		falling[randomLeaf] = true;
	}

	for (let i = 0; i < leafX.length; i++) {
		// 1. Berührt?
		let d = dist(mouseX, mouseY, leafX[i], leafY[i]);
		let ox = 0;
		let oy = 0;
		if (d < 30 && mouseIsPressed) {
			falling[i] = true;

		}

		// 2. Bewegen
		if (falling[i]) {
			leafX[i] += (points[i].x - leafX[i]) * 0.02;
			leafY[i] += (points[i].y - leafY[i]) * 0.02;
			let toFont = dist(leafX[i], leafY[i], points[i].x, points[i].y);
			let swing = map(toFont, 300, 0, 50, 0);
			swing = constrain(swing, 0, 50);
			ox = sin(frameCount * 0.15 + i) * swing;
		}

		if (d < 60 && !falling[i]) {
			ox = sin(frameCount * 0.05 + i) * 4;
			oy = cos(frameCount * 0.05 + i) * 4;

		}

		// 3. Zeichnen
		leaf(leafX[i] + ox, leafY[i] + oy, leafColor[i], leafAngle[i]);
	}

	for (let i = 0; i < pileLeafX.length; i++) {
		leaf(pileLeafX[i], pileLeafY[i], pileColor[i], leafAngle[i]);

	}

}

function branch(x1, y1, x2, y2, w) {
	// 1. Rechnen
	let dx = x2 - x1;
	let dy = y2 - y1;
	let mx = (x1 + x2) / 2;
	let my = (y1 + y2) / 2;

	// 2. Knickpunkt: die Mitte, aber etwas nach oben verschoben
	let bx = mx;
	let by = my - 15;

	// 3. Der Ast in zwei Stücken
	strokeWeight(w);
	line(x1, y1, bx, by);
	strokeWeight(w * 0.6);
	line(bx, by, x2, y2);

	// 4. Die Zweige (wie bisher)
	strokeWeight(w / 2);
	line(x2, y2, x2 + dx * 0.5, y2 + dy * 0.5 - 20);
	line(x2, y2, x2 + dx * 0.5, y2 + dy * 0.5 + 20);
	line(bx, by, bx + dx * 0.3, by + dy * 0.3 - 30);
	line(bx, by, bx + dx * 0.3, by + dy * 0.3 + 30);
}

function leaf(x, y, col, angle) {
	push();
	translate(x, y);
	rotate(angle);
	fill(col);
	beginShape();
	for (let a = 0; a < TWO_PI; a += 0.2) {
		vertex(cos(a) * 12, sin(a) * abs(sin(a)) * 4);
	}
	endShape(CLOSE);
	stroke(0, 0, 0, 60);
	strokeWeight(1);
	line(-12, 0, 12, 0);
	noFill();
	let side = 1;
	if (angle > PI) {
		side = -1;
	}
	beginShape();
	for (let t = 0; t <= 1; t += 0.25) {
		vertex(-12 - t * 6, t * t * 2 * side);
	}
	endShape();
	pop();
}
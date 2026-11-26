let table;
let years = [];
let yearSlider;
let scenarioRadio;
let pigeons0 = [];
let healthy0 = [];
let pigeons50 = [];
let healthy50 = [];
let pigeons90 = [];
let healthy90 = [];
let healthyFood = ["corn", "peas", "sunflower seeds"];
let malnourishedFood = ["fries", "bread", "popcorn", "pizza"];
let cols = 30;
let spacing = 40;
let pigeonSize = 1.6;
let started = false;

async function setup() {
    createCanvas(windowWidth, windowHeight);
    noStroke();

    let gridWidth = (cols - 1) * spacing;
    let startX = (width - gridWidth) / 2;
    let leftEdge = startX - 11 * pigeonSize;
    let sliderWidth = gridWidth + 25 * pigeonSize;

    table = await loadTable("daten.csv", ",", "header");

    for (let row = 0; row < table.getRowCount(); row++) {
        years.push(table.getString(row, "Jahr"));
        pigeons0.push(table.getNum(row, "Tauben_0"));
        healthy0.push(table.getNum(row, "Gesund_0"));
        pigeons50.push(table.getNum(row, "Tauben_50"));
        healthy50.push(table.getNum(row, "Gesund_50"));
        pigeons90.push(table.getNum(row, "Tauben_90"));
        healthy90.push(table.getNum(row, "Gesund_90"));
    }

    yearSlider = createSlider(0, years.length - 1, 0, 1);
    yearSlider.size(sliderWidth);
    yearSlider.position(leftEdge, 190);
    yearSlider.style("accent-color", "#4F5B66");

    scenarioRadio = createRadio();
    scenarioRadio.option("0% ");
    scenarioRadio.option("50% ");
    scenarioRadio.option("90% ");
    scenarioRadio.selected("0% ");
    // Schalter direkt hinter die Beschriftung setzen (Breite messen)
    textSize(16);
    textStyle(BOLD);
    let labelWidth = textWidth("Eggs replaced with dummy eggs:");
    textStyle(NORMAL);

    scenarioRadio.position(leftEdge + labelWidth + 12, 117);
    scenarioRadio.style("accent-color", "#4F5B66");
    scenarioRadio.style("font-family", "sans-serif");
    scenarioRadio.style("font-size", "16px");

    // Am Anfang ist das Intro zu sehen, darum Steuerung verstecken
    yearSlider.hide();
    scenarioRadio.hide();
}

function draw() {
    background(255);

    // Intro: solange noch nicht geklickt wurde, nur das Intro zeichnen
    if (!started) {
        drawIntro();
        return;
    }

    let yearIndex = yearSlider.value();
    let choice = scenarioRadio.value();

    let pigeons;
    let healthy;

    if (choice == "0% ") {
        pigeons = pigeons0[yearIndex];
        healthy = healthy0[yearIndex];
    } else if (choice == "50% ") {
        pigeons = pigeons50[yearIndex];
        healthy = healthy50[yearIndex];
    } else {
        pigeons = pigeons90[yearIndex];
        healthy = healthy90[yearIndex];
    }

    let count = round(pigeons / 100);
    let healthyCount = round(count * healthy / 100);
    let gridWidth = (cols - 1) * spacing;
    let startX = (width - gridWidth) / 2;
    let endX = startX + gridWidth;

    let leftEdge = startX - 11 * pigeonSize;
    let rightEdge = endX + 14 * pigeonSize;

    let hoverStatus = "";
    let hoverFood;
    let hoverX;
    let hoverY;
    let hoverColor;
    let hoverSize;

    // Tauben-Raster
    for (let i = 0; i < count; i++) {
        let col = i % cols;
        let row = floor(i / cols);

        let x = startX + col * spacing;
        let y = 280 + row * spacing;

        let d = dist(mouseX, mouseY, x, y);

        if (i < healthyCount) {
            fill("#7D8A96");
        } else {
            fill("#C8553D");
        }

        // Lupe: je näher die Maus, desto grösser
        let size = pigeonSize;
        if (d < 120) {
            size = map(d, 0, 120, pigeonSize * 2, pigeonSize);
        }

        // Hover
        if (d < spacing / 2) {
            hoverX = x;
            hoverY = y;
            hoverSize = size;
            if (mouseIsPressed) {
                hoverSize = pigeonSize * 6;
            }

            if (i < healthyCount) {
                hoverColor = "#4F5B66";
                fill(hoverColor);
                hoverFood = healthyFood[i % healthyFood.length];
                hoverStatus = "Healthy";
            } else {
                hoverColor = "#8E3324";
                fill(hoverColor);
                hoverFood = malnourishedFood[i % malnourishedFood.length];
                hoverStatus = "Malnourished";
            }
        }

        pigeon(x, y, size);
    }

    // Hover-Taube obendrauf
    if (hoverStatus != "") {
        let s = hoverSize;

        if (mouseIsPressed) {
            // Hintergrund ausblenden
            fill(255, 200);
            rect(0, 0, width, height);

            // Futter
            food(hoverFood, hoverX, hoverY + 9 * s, s);

            // Picken
            let tilt = -abs(sin(frameCount * 0.15)) * 1.15;
            fill(hoverColor);
            pigeon(hoverX, hoverY, s, tilt);

            // Text unter der Taube, auf zwei Zeilen
            textAlign(CENTER);
            fill(hoverColor);
            textSize(22);
            textStyle(BOLD);
            text(hoverStatus, hoverX - 4 * s, hoverY + 13 * s);
            textSize(18);
            textStyle(NORMAL);
            text("ate " + hoverFood, hoverX - 4 * s, hoverY + 13 * s + 24);
            textAlign(LEFT);
        } else {
            fill(hoverColor);
            pigeon(hoverX, hoverY, s);
        }
    }

    // Jahreszahlen unter dem Slider
    let yearStep = (rightEdge - leftEdge - 24) / (years.length - 1);

    textSize(16);
    textAlign(CENTER);
    for (let i = 0; i < years.length; i++) {
        let x = leftEdge + 12 + i * yearStep;

        if (i == yearIndex) {
            fill(0);
            textStyle(BOLD);
        } else {
            fill(180);
            textStyle(NORMAL);
        }

        text(years[i], x, 230);
    }
    textAlign(LEFT);
    textStyle(NORMAL);
    fill(0);

    // Hover-Text oben rechts
    if (hoverStatus != "" && !mouseIsPressed) {
        textSize(16);
        textAlign(RIGHT);
        fill(hoverColor);

        // "ate corn" normal, ganz rechts
        textStyle(NORMAL);
        let foodText = " ate " + hoverFood;
        text(foodText, rightEdge, 95);

        // "Healthy" fett, direkt links davor
        let foodWidth = textWidth(foodText);
        textStyle(BOLD);
        text(hoverStatus, rightEdge - foodWidth, 95);

        textStyle(NORMAL);
        textAlign(LEFT);
        fill(0);
    }

    // Titel
    textSize(48);
    textStyle(BOLD);

    fill(0);
    text(nfc(pigeons) + " pigeons", leftEdge, 60);

    textAlign(RIGHT);
    fill("#C8553D");
    text((100 - healthy) + "% malnourished", rightEdge, 60);

    // Untertitel und Schalter-Beschriftung
    fill(0);
    textAlign(LEFT);
    textStyle(NORMAL);
    textSize(16);
    text("What if Zurich swapped pigeon eggs for dummy eggs?", leftEdge, 95);

    textStyle(BOLD);
    text("Eggs replaced with dummy eggs:", leftEdge, 130);

    // Legende (von rechts nach links aufgebaut, Abstände mit textWidth gemessen)
    textStyle(NORMAL);
    textSize(16);
    textAlign(RIGHT);
    fill(0);
    text("1 pigeon = 100 pigeons", rightEdge, 125);

    let gap = 30;                                          // Abstand Text -> Taube
    let malX = rightEdge;                                  // Text "malnourished" endet hier
    let malPigeonX = malX - textWidth("malnourished") - gap;
    let healthyX = malPigeonX - 18 * pigeonSize;           // "healthy" endet links vor der roten Taube
    let healthyPigeonX = healthyX - textWidth("healthy") - gap;

    fill(0);
    text("malnourished", malX, 160);
    fill("#C8553D");
    pigeon(malPigeonX, 155, pigeonSize);

    fill(0);
    text("healthy", healthyX, 160);
    fill("#7D8A96");
    pigeon(healthyPigeonX, 155, pigeonSize);

    // Hinweis zu den Daten
    textSize(12);
    fill(150);
    textAlign(LEFT);
    text("Illustrative model data, based on the estimate of 16,000 city pigeons in Zurich.", leftEdge, height - 20);

    textAlign(LEFT);
}

function mousePressed() {
    if (!started) {
        started = true;
        yearSlider.show();
        scenarioRadio.show();
    }
}

function drawIntro() {
    let S = min(width, height) / 40;        // Grösse der Intro-Taube
    let cx = width / 2;
    let cy = height / 2 - 40;

    // Schatten am Boden
    fill(235);
    ellipse(cx, cy + 9.8 * S, 22 * S, 1.6 * S);

    // grosse Taube
    fill("#7D8A96");
    pigeon(cx, cy, S);

    // Auge, das der Maus folgt
    let eyeX = cx - 6.6 * S;
    let eyeY = cy - 10.6 * S;
    fill(255);
    circle(eyeX, eyeY, 1.8 * S);
    let angle = atan2(mouseY - eyeY, mouseX - eyeX);
    fill(20);
    circle(eyeX + cos(angle) * 0.4 * S, eyeY + sin(angle) * 0.4 * S, 0.9 * S);

    // Text
    textAlign(CENTER);
    fill(0);
    textStyle(BOLD);
    textSize(44);
    text("16,000 pigeons live in Zurich.", width / 2, cy + 13 * S);

    textStyle(NORMAL);
    textSize(18);
    fill(120);
    text("Click anywhere to see what could happen to them.", width / 2, cy + 13 * S + 40);
    textAlign(LEFT);
}

function pigeon(x, y, s, tilt = 0) {
    push();
    translate(x, y);
    scale(s);

    // Beine
    push();
    fill(220, 120, 130);
    quad(-0.2, 5, 1, 5, -0.2, 8.9, -1.1, 8.9);           // Bein
    quad(-1, 8.4, -3.8, 9.2, -3.6, 9.6, -0.8, 9.5);      // vordere Zehe
    quad(-1, 8.6, -2.8, 9.7, -2.4, 9.9, -0.7, 9.4);      // seitliche Zehe
    quad(-0.6, 8.6, 1.2, 9.3, 1.1, 9.6, -0.6, 9.5);      // hintere Zehe
    circle(-0.6, 9, 1.1);                                // Gelenk
    pop();

    // Körper um die Hüfte kippen (fürs Picken)
    translate(0, 4.5);
    rotate(tilt);
    translate(0, -4.5);

    // Körper
    beginShape();
    splineVertex(-8.5, -11);
    splineVertex(-6.5, -12.5);
    splineVertex(-4.3, -11.6);
    splineVertex(-3.8, -9);
    splineVertex(-2.8, -5.5);
    splineVertex(0, -3);
    splineVertex(5, 0.5);
    splineVertex(10, 4.5);
    splineVertex(14, 8);
    splineVertex(12.5, 8.8);
    splineVertex(8, 7);
    splineVertex(3, 5.8);
    splineVertex(-1, 6);
    splineVertex(-5, 4);
    splineVertex(-8, 0);
    splineVertex(-8.6, -4);
    splineVertex(-8, -7.5);
    splineVertex(-8.9, -9.8);
    splineVertex(-8.5, -11);
    splineVertex(-6.5, -12.5);
    splineVertex(-4.3, -11.6);
    endShape();

    // Schnabel
    fill(60);
    triangle(-8.6, -10.8, -11, -9.8, -8.8, -9.4);

    // Auge
    fill(20);
    circle(-6.6, -10.6, 1.2);

    pop();
}

function food(name, fx, fy, s) {
    push();
    translate(fx, fy);
    scale(s);
    strokeWeight(1 / s);

    if (name == "corn") {
        fill("#F2C230");
        let pts = [[-14, 0.3], [-15.8, 0], [-17.5, 0.4], [-19.2, 0.1], [-21, 0.4], [-16.6, -0.9], [-18.6, -0.8], [-20.3, -0.7]];
        for (let p of pts) {
            ellipse(p[0], p[1], 1.5, 1.3);
        }

    } else if (name == "peas") {
        let pts = [[-14, 0.2], [-15.7, 0.3], [-17.4, 0.2], [-19.1, 0.3], [-20.8, 0.2], [-16.5, -1.1], [-18.2, -1.1], [-19.9, -1.1]];
        for (let p of pts) {
            fill("#7BAE4A");
            circle(p[0], p[1], 1.6);
            fill("#A9D17C");
            circle(p[0] - 0.3, p[1] - 0.3, 0.5);
        }

    } else if (name == "sunflower seeds") {
        let pts = [[-14, 0.3, 0.2], [-16.2, 0, -0.5], [-18, 0.4, 0.4], [-19.8, 0, -0.2], [-21.5, 0.3, 0.6], [-17, -0.9, 1.1], [-20.5, -0.9, -0.9]];
        for (let p of pts) {
            push();
            translate(p[0], p[1]);
            rotate(p[2]);
            fill("#3B3B3B");
            ellipse(0, 0, 2.2, 1.1);
            fill("#D8D8D8");
            ellipse(0, 0, 1.8, 0.25);
            pop();
        }

    } else if (name == "fries") {
        // Pommes: x, y, Drehung, Länge
        let spilled = [[-15.5, 0.1, 1.5, 4.2], [-17.5, -0.5, 1.75, 4.8], [-19, 0.2, 1.35, 3.8], [-16.8, -1.3, 1.62, 3.6]];
        let inBox = [[-21.5, -2.4, 1.45, 3.5], [-21.5, -0.9, 1.62, 3.2], [-21.5, -3, 1.3, 2.8], [-21.5, 0.2, 1.55, 2.6]];
        let allFries = spilled.concat(inBox);

        for (let f of allFries) {
            push();
            translate(f[0], f[1]);
            rotate(f[2]);
            fill("#E0A532");
            rect(-0.525, -f[3], 1.05, f[3]);
            fill("#F6CF5A");
            rect(-0.3, -(f[3] - 0.3), 0.6, f[3] - 0.3);
            pop();
        }

        // Schachtel, auf der Seite liegend
        fill("#D9443A");
        quad(-27.5, -1.9, -21.2, -3.6, -21.2, 1, -27.5, 1);
        fill("#F4E9DA");
        quad(-27.5, -0.9, -21.2, -1.9, -21.2, -1.2, -27.5, -0.4);
        fill("#A9322A");
        quad(-21.7, -3.45, -21.2, -3.6, -21.2, 1, -21.7, 1);

    } else if (name == "bread") {
        // Krümel
        fill("#E2BE84");
        let crumbs = [[-16.5, 0.4, 0.96], [-17.8, 0.2, 0.6], [-27.6, 0.4, 0.84], [-15.3, 0.1, 0.54]];
        for (let c of crumbs) {
            circle(c[0], c[1], c[2]);
        }

        // Toastscheibe: zuerst Kruste, dann das Innere etwas kleiner darüber
        push();
        translate(-23, -1.6);
        rotate(0.12);
        let layers = [["#B8813F", 1], ["#F1D9A6", 0.78]];
        for (let l of layers) {
            let w = 5.5 * l[1];
            let h = 3.96 * l[1];
            let r = 1.6 * l[1];
            fill(l[0]);
            rect(-w / 2, -h / 2 + 0.22, w, h - 0.22);
            circle(-w / 2 + r, -h / 2 + 0.22, r * 2);
            circle(w / 2 - r, -h / 2 + 0.22, r * 2);
        }
        pop();

    } else if (name == "popcorn") {
        let pts = [[-16, -0.7], [-19.6, -0.8], [-23.2, -0.7], [-17.8, -2.8], [-21.4, -2.9]];
        let puffs = [[0, 0, 1.6], [1, -0.45, 1.35], [-0.85, -0.6, 1.35], [0.15, -1.25, 1.4], [0.75, 0.45, 1.05], [-0.65, 0.45, 1.05]];
        for (let p of pts) {
            // Schatten
            fill("#E6CF97");
            for (let q of puffs) {
                circle(p[0] + q[0] + 0.12, p[1] + q[1] + 0.15, q[2]);
            }
            // weisse Flocken
            fill("#FFFBF0");
            for (let q of puffs) {
                circle(p[0] + q[0], p[1] + q[1], q[2] * 0.92);
            }
            // gelber Kern
            fill("#E3A93B");
            ellipse(p[0] + 0.15, p[1] + 0.6, 0.9, 0.5);
        }

    } else if (name == "pizza") {
        fill("#F5C94F");
        triangle(-14.5, 0.2, -23, -1.8, -23, 1.6);
        fill("#C98A3E");
        rect(-23.7, -2, 1.4, 3.8, 0.5);
        fill("#C0392B");
        ellipse(-19.5, -0.3, 1.3, 0.9);
        ellipse(-21.3, 0.6, 1.3, 0.9);
        ellipse(-17.5, 0.3, 1.3, 0.9);
    }

    pop();
}
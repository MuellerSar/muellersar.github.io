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
let healthyFood = ["wheat", "corn", "peas", "barley", "millet", "sunflower seeds", "lentils", "hemp seeds"];
let sickFood = ["bread", "fries", "pizza crust", "croissant crumbs", "kebab leftovers", "chips", "popcorn", "burger bun"];
let cols = 30;
let spacing = 40;
let pigeonSize = 1.6;

async function setup() {
    createCanvas(windowWidth, windowHeight);
    let gridWidth = (cols - 1) * spacing;
    let startX = (width - gridWidth) / 2;
    noStroke();

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
    yearSlider.size(gridWidth);
    yearSlider.position(startX, 190);
    yearSlider.style("accent-color", "#505050");

    scenarioRadio = createRadio();
    scenarioRadio.option("0 %");
    scenarioRadio.option("50 %");
    scenarioRadio.option("90 %");
    scenarioRadio.selected("0 %");
    scenarioRadio.position(startX, 150);
    scenarioRadio.style("accent-color", "#505050");
    scenarioRadio.style("font-family", "sans-serif");
}

function draw() {
    background(255);

    let yearIndex = yearSlider.value();
    let choice = scenarioRadio.value();

    let pigeons;
    let healthy;

    if (choice == "0 %") {
        pigeons = pigeons0[yearIndex];
        healthy = healthy0[yearIndex];
    } else if (choice == "50 %") {
        pigeons = pigeons50[yearIndex];
        healthy = healthy50[yearIndex];
    } else {
        pigeons = pigeons90[yearIndex];
        healthy = healthy90[yearIndex];
    }

    let count = round(pigeons / 100);
    let healthyCount = round(count * healthy / 100)
    let gridWidth = (cols - 1) * spacing;
    let startX = (width - gridWidth) / 2;
    let endX = startX + gridWidth;

    let hoverText = "";

    for (let i = 0; i < count; i++) {
        let col = i % cols;
        let row = floor(i / cols);

        let x = startX + col * spacing;
        let y = (100 + row * spacing) + 180;

        let d = dist(mouseX, mouseY, x, y);

        if (i < healthyCount) {
            fill(80);
        } else {
            fill(255, 0, 0)
        }

        if (d < 25) {
            fill(0, 0, 255)
            if (i < healthyCount) {
                hoverText = "Healthy · ate: " + healthyFood[i % healthyFood.length];
            } else {
                hoverText = "Sick · ate: " + sickFood[i % sickFood.length];
            }
        }

        pigeon(x, y, 1.6);

    }

    let yearStep = (gridWidth - 24) / (years.length - 1);

    fill(0);
    textAlign(CENTER);
    for (let i = 0; i < years.length; i++) {
        let x = (startX + i * yearStep) + 12;

        text(years[i], x, 230)
    }
    textAlign(LEFT);

    fill(0);
    text(hoverText, mouseX + 15, mouseY);

    textAlign(RIGHT);

    textSize(32);
    text(nfc(pigeons) + " pigeons", endX, 70);

    textSize(16);
    text((100 - healthy) + "% sick", endX, 95);

    textSize(14);
    text("1 pigeon = 100 pigeons", endX, 125);

    text("sick", endX, 160);
    fill(255, 0, 0);
    pigeon(endX - 50, 155, pigeonSize);

    fill(0);
    text("healthy", endX - 80, 160);
    fill(80);
    pigeon(endX - 155, 155, pigeonSize);

    textAlign(LEFT);

}

function pigeon(x, y, s) {
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
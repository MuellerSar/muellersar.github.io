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

async function setup() {
    createCanvas(windowWidth, windowHeight);
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
    yearSlider.position(50, 20);

    scenarioRadio = createRadio();
    scenarioRadio.option("0 %");
    scenarioRadio.option("50 %");
    scenarioRadio.option("90 %");
    scenarioRadio.selected("0 %");
    scenarioRadio.position(50, 500);
}

function draw() {
    background(255);

    let yearIndex = yearSlider.value();
    let choice = scenarioRadio.value();

    fill(80);
    text(years[yearIndex], 200, 35)

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

    let hoverText = "";

    for (let i = 0; i < count; i++) {
        let col = i % 25;
        let row = floor(i / 25);

        let x = 50 + col * 30;
        let y = 100 + row * 30;

        let d = dist(mouseX, mouseY, x, y);

        if (i < healthyCount) {
            fill(80);
        } else {
            fill(255, 0, 0)
        }

        if (d < 10) {
            fill(0, 0, 255)
            if (i < healthyCount) {
                hoverText = "Healthy · ate: " + healthyFood[i % healthyFood.length];
            } else {
                hoverText = "Sick · ate: " + sickFood[i % sickFood.length];
            }
        }

        circle(x, y, 20);

    }
    
    fill(0);
    text(hoverText, mouseX + 15, mouseY);

}
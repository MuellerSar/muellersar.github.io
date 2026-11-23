let table;
let years = [];
let yearSlider;
let pigeons0 = [];
let healthy0 = [];
let pigeons50 = [];
let healthy50 = [];
let pigeons90 = [];
let healthy90 = [];

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
}

function draw() {
    background(255);

    let yearIndex = yearSlider.value();

    let count = round(pigeons0[yearIndex] / 100);
    let healthyCount = round(count * healthy0[yearIndex] / 100)

    for (let i = 0; i < count; i++) {
        let col = i % 25;
        let row = floor(i / 25);

        let x = 50 + col * 30;
        let y = 100 + row * 30;

        if (i < healthyCount) {
            fill(80);
        } else {
            fill(255, 0, 0)
        }

        circle(x, y, 20);

    }

}
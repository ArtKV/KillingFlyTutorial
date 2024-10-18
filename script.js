const pole = document.querySelector(".Арена");
let width = parseFloat(window.getComputedStyle(pole).width);
let height = parseFloat(window.getComputedStyle(pole).height);
let fly = document.getElementById("РабСистемы");
fly.style.top = String(Math.random() * height) + "px";
fly.style.left = String(Math.random() * width) + "px";
let audio = new Audio('Удар.mp3');
let count = 0;
elCount = document.getElementById("countSpan");
elTimer = document.getElementById("timerSpan");
elFly = document.getElementById("МухаПНГ");
difficultList = [3000, 2000, 1000, 500];
elSpawnTimer = difficultList[0];
const constTimer = parseInt(elTimer.innerText);
let now = new Date();
let radios = document.getElementsByName("difficult");

let init = function() {
    for( let i = 0; i < radios.length; i++) {    
        radios[i].onclick = function() {
            elSpawnTimer = difficultList[i];
        }
    }
    change2();
    showLeaderboard();
    $('#difficultChoose').change(showLeaderboard);
}

let hideAllTables = function() {
    $('table').hide();
}

let showLeaderboard = function() {
    hideAllTables();
    $('table:eq(' + $('#difficultChoose').val() + ')').show();
}

let change2 = function() {
    fly.style.top = String(Math.random() * height) + "px";
    fly.style.left = String(Math.random() * width) + "px";
    fly.style.transform = "rotate(" + Math.random() * 359 + "deg)";
    elFly.style.visibility = "visible";
    setTimeout(change2, elSpawnTimer);
};

function change() {
    elFly.style.visibility = "hidden";
    elCount.innerText++;
    audio.play();
}

function reset() {
    elCount.innerText = 0;
    elTimer.innerText = constTimer;
    now = new Date();
    turnOffRadio(true);
}

function turnOffRadio(onOff) {
    for (let i = 0; i < radios.length; i++)
        radios[i].disabled = onOff;
}

let start = function() {
    document.getElementById("МухаПНГ").addEventListener("click", change);
    reset();
    const constInterval = setInterval(function timer() {
        elTimer.innerText = constTimer - parseInt((new Date() - now) / 1000);
        if (elTimer.innerText <= 0) {
            let tableNum = $('input[name=difficult]:checked').val();
            records(tableNum);
            document.getElementById("МухаПНГ").removeEventListener("click", change);
            clearInterval(constInterval);
            reset();
            turnOffRadio(false);
        }
    }, 100);
}

let addRecord = function(tableNum) {
    const name = prompt("Результат: " + elCount.innerText + "\r\nКто ты, Воин?");
    if (name) {
        console.log('tableNum'+ tableNum);
        $('tbody:eq('+tableNum+')').append("<tr><td>?</td><td >" + elCount.innerText + "</td><td>" + name + "</td></tr>");
    }
}

let sortRecords = function(tableNum) {
    let tbody = $('tbody:eq('+tableNum+')');
    tbody.find('tr').sort(function(a, b) {
        return $('td:eq(1)', b).text().localeCompare($('td:eq(1)', a).text(), undefined, {numeric: true});
    }).appendTo(tbody);
}

let fillPlaces = function(tableNum) {
    let recordRows = $('tbody:eq('+tableNum+')').find('tr');
    for (let i = 0; i < recordRows.length; i++) {
        recordRows.eq(i).find('td').eq(0).html(i + 1);
    }
}

let records = function(tableNum) {
    addRecord(tableNum);
    sortRecords(tableNum);
    fillPlaces(tableNum);
}

init();
const audio = new Audio('Удар.mp3');
const flyW = $('#РабСистемы').width();
const flyH = $('#РабСистемы').height();
const difficultList = [3000, 2000, 1000, 500];
const pole = document.querySelector(".Арена");
const constTimer = parseInt($('#timerSpan').text());
const width = parseFloat(window.getComputedStyle(pole).width);
const height = parseFloat(window.getComputedStyle(pole).height);

let constInterval;
var spawnIntervalId;
let now = new Date();
let count = 0;
let clickCount = 0;
let totalFlyCount = 1;
let elSpawnTimer = difficultList[0];
let elFly = document.getElementById("МухаПНГ");
let fly = document.getElementById("РабСистемы");
let elCount = document.getElementById("countSpan");
let elTimer = document.getElementById("timerSpan");
let radios = document.getElementsByName("difficult");
let elAccuracy = document.getElementById("accuracySpan");

fly.style.left = String(Math.random() * (width - flyW)) + "px";
fly.style.top = String(Math.random() * (height - flyH)) + "px";

// инициализация
let init = function() {
    $("#stopBtn").prop('disabled', true);
    elFly.style.visibility = "hidden";
    for( let i = 0; i < radios.length; i++) {    
        radios[i].onclick = function() {
            elSpawnTimer = difficultList[i];
        }
    }
    showLeaderboard();
    $('#difficultChoose').change(showLeaderboard);
    $('.Арена').on('click', function() {
        if (radios[0].disabled) {
            clickCount++;
            elAccuracy.innerText = count + ' / ' + clickCount + ' (' +
                Math.round(count / clickCount * 100 * 100) / 100 + '%)';
        }
    });
}

// скрыть все результаты в таблицах 
let hideAllTBodies = function() {
    $('tbody').hide();
}

// показать таблицу рекордов
let showLeaderboard = function() {
    hideAllTBodies();
    $('tbody:eq(' + $('#difficultChoose').val() + ')').show();
}

// автореспавн мухи по времени
let flyRespawn = function() {
    fly.style.top = String(Math.random() * (height - flyH)) + "px";
    fly.style.left = String(Math.random() * (width - flyW)) + "px";
    fly.style.transform = "rotate(" + Math.random() * 359 + "deg)";
    elFly.style.visibility = "visible";
    totalFlyCount++;
    elCount.innerText = count + " / " + totalFlyCount +
        ' (' + Math.round(count / totalFlyCount * 100 * 100) / 100 + '%)';
}

// попал в муху
function change() {
    elFly.style.visibility = "hidden";
    count++;
    elCount.innerText = count + " / " + totalFlyCount +
        ' (' + Math.round(count / totalFlyCount * 100 * 100) / 100 + '%)';
    audio.play();
}

// сброс
function reset() {
    count = 0;
    clickCount = 0;
    totalFlyCount = 1;
    elCount.innerText = '?';
    elAccuracy.innerText = '?';
    elTimer.innerText = constTimer;
    elFly.style.visibility = "hidden";
    radiosDisabled(true);
}

// ВКЛ/ВЫКЛ выбор сложности
function radiosDisabled(onOff) {
    for (let i = 0; i < radios.length; i++)
        radios[i].disabled = onOff;
}

// начать игру
let start = function() {
    intervalSpawnId = setInterval(flyRespawn, elSpawnTimer);
    $("#startBtn").prop('disabled', true);
    $("#stopBtn").prop('disabled', false);
    now = new Date();
    document.getElementById("МухаПНГ").addEventListener("click", change);
    reset();
    elFly.style.visibility = "visible";
    constInterval = setInterval(function timer() {
        elTimer.innerText = constTimer - parseInt((new Date() - now) / 1000);
        if (elTimer.innerText <= 0) {
            let tbodyNum = $('input[name=difficult]:checked').val();
            records(tbodyNum);
            document.getElementById("МухаПНГ").removeEventListener("click", change);
            stop();
        }
    }, 100);
}

// остановить игру
let stop = function() {
    reset();
    $("#startBtn").prop('disabled', false);
    $("#stopBtn").prop('disabled', true);
    radiosDisabled(false);
    clearInterval(constInterval);
    clearInterval(intervalSpawnId);
}

// добавить запись в таблицу рекордов
let addRecord = function(tbodyNum) {
    const name = prompt("Результат: " + count + "\r\nКто ты, Воин?");
    if (name) {
        $('tbody:eq('+tbodyNum+')').append("<tr><td>?</td><td >" + count + "</td><td>" + name + "</td></tr>");
    }
}

// отсортировать по убыванию игроков в таблице рекордов
let sortRecords = function(tbodyNum) {
    let tbody = $('tbody:eq('+tbodyNum+')');
    tbody.find('tr').sort(function(a, b) {
        return $('td:eq(1)', b).text().localeCompare($('td:eq(1)', a).text(), undefined, {numeric: true});
    }).appendTo(tbody);
}

// подписать места в таблице рекордов у игроков
let fillPlaces = function(tbodyNum) {
    let recordRows = $('tbody:eq('+tbodyNum+')').find('tr');
    for (let i = 0; i < recordRows.length; i++) {
        recordRows.eq(i).find('td').eq(0).html(i + 1);
    }
}

let records = function(tbodyNum) {
    addRecord(tbodyNum);
    sortRecords(tbodyNum);
    fillPlaces(tbodyNum);
}

init();
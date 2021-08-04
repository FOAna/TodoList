// let time = new Date(Date.parse(new Date()) + 10 * 1000);

let timeinterval = null;
let totalTime = null;
let timeIntervals = []; // список таймеров по порядку
let isPaused = false;

function getTimeRemaining(endtime) {
  /* Date.parse принимает объект Date и возвращает количество милисекунд от начала времён (1 января 1970 года) до момента,
    который был передан
    new Date - текущий момент времени
    endtime - это момент времени, когда таймер закончится (new Date + время таймера)
    totalTime - оставшееся время до конца таймера, то, что отображается в вёрстке
  */
  const totalTime = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor((totalTime / 1000) % 60);
  const minutes = Math.floor((totalTime / 1000 / 60) % 60);
  return {
    totalTime,
    minutes,
    seconds,
  };
}

function initializeClock(endtime) {
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");

  function updateClock() {
    totalTime = getTimeRemaining(endtime); // Текущее время

    minutesSpan.innerHTML = ("0" + totalTime.minutes).slice(-2);
    secondsSpan.innerHTML = ("0" + totalTime.seconds).slice(-2);

    if (totalTime.totalTime <= 0) {
      clearInterval(timeinterval);
      timeIntervals.shift();
      //console.log(`Оставшиеся интервалы: ${JSON.stringify(timeIntervals)}`); // вывод в виде текста, JSON нужен из-за интерполяции
      if (timeIntervals.length) {
        initializeClock(
          new Date(
            Date.parse(new Date()) + timeIntervals[0].time /** 60*/ * 1000
          )
        );
        console.log(`Интервал: ${timeIntervals[0].intervalName}`);
        document.getElementById("currentStage").textContent =
          timeIntervals[0].intervalName == "workTime"
            ? "Работай, солнце ещё высоко!"
            : timeIntervals[0].intervalName == "breakTime"
            ? "Сделаю паузу, скушай Twix!"
            : "Ликуй! Ещё больше отдыха!";
      } else {
        alert("Ваше время истекло! Молитесь!");
        clearInterval(timeinterval);
        timeinterval = null;
        document.getElementById("currentStage").textContent =
          "Теперь Добби свободен!";
      }
    }
  }

  updateClock();
  timeinterval = setInterval(updateClock, 1000); // вызов updateClock каждую секунду
}

document.getElementById("start").addEventListener("click", function () {
  if (isPaused) {
    initializeClock(new Date(Date.parse(new Date()) + totalTime.totalTime));
    isPaused = false;
    return;
  }

  if (timeinterval) {
    clearInterval(timeinterval);
    timeinterval = null;
    timeIntervals = [];
  }
  const workTime = document.getElementById("workTime").value;
  const breakTime = document.getElementById("breakTime").value;
  const restTime = document.getElementById("restTime").value;
  const roundCount = document.getElementById("roundCount").value;
  const repeatCount = document.getElementById("repeatCount").value;

  for (let i = repeatCount; i > 0; i--) {
    for (let j = roundCount; j > 0; j--) {
      timeIntervals.push({ intervalName: "workTime", time: workTime });
      timeIntervals.push({ intervalName: "breakTime", time: breakTime });
    }
    timeIntervals.push({ intervalName: "restTime", time: restTime });
  }

  initializeClock(new Date(Date.parse(new Date()) + workTime /** 60*/ * 1000));
  document.getElementById("currentStage").textContent =
    "Работай, солнце ещё высоко!";

  console.log(timeIntervals); // вывод в первозданном виде (объект)
});

document.getElementById("stop").addEventListener("click", function () {
  const minutesSpan = document.getElementById("minutes");
  const secondsSpan = document.getElementById("seconds");
  clearInterval(timeinterval); // очищаем интервал, удаляем то, что запустил SetInterval (системная штука, управляется
  //с помощью переменной, при вызове возвращает id, с которым можно удалить этот интервал)
  timeinterval = null; // удаляем id интервала
  timeIntervals = []; // очищаем массив
  minutesSpan.innerHTML = "00";
  secondsSpan.innerHTML = "00";
  document.getElementById("currentStage").textContent = "Ты куда?";
});

document.getElementById("pause").addEventListener("click", function () {
  isPaused = true;
  clearInterval(timeinterval);
  timeinterval = null;
  document.getElementById("currentStage").textContent = "Пауза";
});

document.getElementById("workTime").addEventListener("change", function () {
  if (isPaused) isPaused = false;
});

document.getElementById("breakTime").addEventListener("change", function () {
  if (isPaused) isPaused = false;
});

document.getElementById("restTime").addEventListener("change", function () {
  if (isPaused) isPaused = false;
});

document.getElementById("roundCount").addEventListener("change", function () {
  if (isPaused) isPaused = false;
});

document.getElementById("repeatCount").addEventListener("change", function () {
  if (isPaused) isPaused = false;
});

// По клику на шестерёнку добавляем блоку настроек новый класс, чтобы по нему изменить CSS
document.getElementById("settings").addEventListener("click", function (event) {
  event.stopPropagation(); // все клики по элементу игнорируются
  document
    .querySelector(".timer__settings")
    .classList.add("timer__settings_show");
});

document.addEventListener(
  "click",
  function (event) {
    if (!event.target.closest(".timer__settings")) {
      document
        .querySelector(".timer__settings")
        .classList.remove("timer__settings_show");
    }
  },
  false
);

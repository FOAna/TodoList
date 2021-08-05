const express = require("express"); // require - загружаем библиотеку
const pg = require("pg");
const Sequelize = require("sequelize");
const app = express(); // создаём приложение
const port = 3000; // порт, на котором будем слушать (сервер слушает, а клиент обращается)

const conString =
  "postgres://jtkfeqxe:nSjEsod-wyuApkKDtP8zqrGVSyPqrslc@hattie.db.elephantsql.com/jtkfeqxe"; // сохранение адреса базы данных
const client = new pg.Client(conString); // создаём клиент, который может ходить в базу данных

// конфигурация Sequelize, который будет ходить в базу данных
const sequelize = new Sequelize(
  // вся информация берётся из адреса базы данных postgres://username:password@hostname/databasename
  "jtkfeqxe", // имя базы данных
  "jtkfeqxe", // пользователь
  "nSjEsod-wyuApkKDtP8zqrGVSyPqrslc", // пароль
  {
    dialect: "postgres",
    host: "hattie.db.elephantsql.com",
  }
);

// Madel - это информация об устройстве таблицы
class Tasks extends Sequelize.Model {} // создаём модель таблицы Tasks, которая наследует все методы из Sequelize.Model
Tasks.init(
  // описание столбцов таблицы
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    content: {
      type: Sequelize.STRING,
    },
    status: {
      type: Sequelize.STRING,
    },
  },
  { sequelize, modelName: "task" } // sequelize то же самое, что sequelize: sequelize
);

// синхронизация с базой данных, возвращает Promise
sequelize.sync({ force: true }).then(() => {
  app.set("view engine", "hbs"); // указываем используемый шаблонизатор, view engine - механизм визуализации

  app.use(express.static("public")); // express раздаёт static из папки public

  // по пути / отдавай то, что в res.send; request - запрос клиента, response - ответ сервера
  app.get("/", (req, res) => {
    //res.send('Hello World!');
    //res.sendFile("index.hbs", { root: '.' }); // root - это путь к файлу
    res.render("index", { static: `http://localhost:${port}` }); //
  });

  app.get("/bla", (req, res) => {
    sequelize
      .authenticate() // возвращает Promise
      .then(() => {
        Tasks.create({ content: "Пробная задача" }); // создание задачи, строки в таблице Tasks
      })
      .catch((err) => res.send("Connection error: ", err))
      .then(res.send("Завершили работу с базой данных"));
    /* // после установки соединения (connect) вызывает переданную функцию, передаёт в эту функцию результат установки соединения
  // // потом закроет соединение
  // client.connect(function (err) {
  //   if (err) {
  //     return console.error("could not connect to postgres", err); // ранний return вместо else
  //   }
  //   // делает SQL-запрос, переданный первым аргументом, потом вызывает функцию, переданную вторым аргументом,
  //   // и передаёт в неё результат выполнения SQL-запроса
  //   client.query("SELECT * FROM testTable", function (err, result) {
  //     if (err) {
  //       return console.error("error running query", err);
  //     }
  //     res.send(result); // отправление результата на клиент (например, вкладка браузера)
  //     // >> output: 2018-08-23T14:02:57.117Z
  //     client.end();
  //   });
     });*/
  });

  // "Слушай на порту 3000 ..."
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});

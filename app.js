const express = require('express'); // загружаем библиотеку
const app = express(); // создаём приложение
const port = 3000; // порт, на котором будем слушать (сервер слушает, а клиент обращается)

app.set('view engine', 'hbs'); // указываем используемый шаблонизатор, view engine - механизм визуализации

app.use(express.static('public')); // express раздаёт static из папки public

// по пути / отдавай то, что в res.send; request - запрос клиента, response - ответ сервера
app.get('/', (req, res) => {
  //res.send('Hello World!');
  //res.sendFile("index.hbs", { root: '.' }); // root - это путь к файлу
  res.render('index', { static: `http://localhost:${port}`}); //
});

app.get('/bla', (req, res) => {
    res.send("Как неожиданно и приятнааа!");
})

// "Слушай на порту 3000 ..."
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
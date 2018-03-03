const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fs = require('fs');
const { getFullYear, screamIt } = require('./helpers/hbs');

const app = express();

//Handlebars Middleware
app.engine(
  'handlebars',
  exphbs({
    helpers: {
      getFullYear: getFullYear,
      screamIt: screamIt
    },
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', err => {
    if (err) {
      console.log('Unable to log server.log.');
    }
  });
  next();
});

app.use((req, res, next) => {
  res.render('maintenance');
});

//Static path
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('home', {
    title: 'Home Page',
    welcomeMessage: 'Welcome to my website'
  });
});

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Page'
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill request'
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on ${port}`);
});

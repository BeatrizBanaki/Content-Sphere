const express = require('express');
const app = express(); 
const path = require("path");
require("dotenv").config();

// Controllers
const { router: pageController, listCategories, listPages } = require('./controllers/pageController');
const authController = require('./controllers/authController');
const homeController = require('./controllers/homeController'); 

// Session
const session = require("express-session");
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false
    }
}));

// Middleware para parse de URL e conteúdo JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir arquivos estáticos da pasta 'public'
app.use(express.static('public'));

// Mustache
const mustacheExpress = require('mustache-express');
app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// Routes
app.use('/pages', pageController);
app.use('/', authController);
app.use('/home', homeController);


// Rota para a página inicial
// app.get('/home', (req, res) => {
//     const categories = listCategories().map(category => {
//         return {
//             name: category,
//             pages: listPages(category)
//         };
//     });
//     res.render('home', { categories });
// });

// Inicialização do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('http://localhost:3000');
});

// GET
app.get('/', (req, res) => {
    res.redirect('/home');
});

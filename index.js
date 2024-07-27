//Requires gerais
const path = require("path")
require("dotenv").config()

//Express
const express = require('express');
const app = express(); 

//Controller Páginas
const pageController = require('./controllers/pageController');

//Controller Autorização
const authController = require('./controllers/authController');

//Session
const session = require("express-session");
app.use(session({
    secret: process.env.SECRET, // Chave secreta para assinar cookie de sessão 
    resave: false, // Não salvar a sessão se ela não foi modificada
    saveUninitialized: false, // Não criar uma sessão para solicitações que não foram modificadas
    cookie: { 
        secure: false, 
        maxAge: 60000 // Tempo de expiração do cookie de sessão (em milissegundos)
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
app.set('views', __dirname + '/views'); // Pasta de views

// Rota para autenticação do administrador
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true;
        res.redirect('/admin');
    } else {
        res.send('Usuário ou senha inválidos');
    }
});

// Rota de logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
});

// Rota de exemplo para proteger com sessão
app.get('/admin', (req, res, next) => {
    if (req.session.isAuthenticated) {
        next(); // Continuar para o próximo middleware ou rota
    } else {
        res.redirect('/login');
    }
});

// Inicialização do servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log('http://localhost:3000');
});

// GET
app.get('/', (req, res) => {
    res.render('index', { message: 'Bem-vindo ao CMS!' });
});

// Função para listar as páginas
function listPages() {
    try {
        // Ler o diretório de páginas 
        const files = fs.readdirSync(pagesDirectory);

        // Filtrar e mapear os arquivos para obter informações das páginas
        const pages = files.map(file => {
            const pageName = path.parse(file).name; // Nome da página sem extensão
            return { 
                name: pageName, // Nome amigável para exibição
                url: `/${pageName}` // URL para acessar a página
            };
        });

        return pages;
    } catch (err) {
        console.error("Erro ao listar páginas:", err);
        return [];
    }
}

module.exports = { listPages };
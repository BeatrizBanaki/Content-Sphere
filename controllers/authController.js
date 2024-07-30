const express = require('express');
const router = express.Router();

// Página de login (GET)
router.get('/login', (req, res) => {
    if (req.session.isAuthenticated) {
        return res.redirect('/home'); // Redireciona para a página inicial se já estiver autenticado
    }
    res.render('login', {titulo: "Login",login: "Login" }); // Renderiza o template de login
});

// Processar login (POST)
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        req.session.isAuthenticated = true; // Define a sessão como autenticada
        req.session.usuario = username;
        res.redirect('/home'); // Redireciona para a página inicial após login bem-sucedido
    } else {
        res.render('login', { error: 'Usuário ou senha inválidos', titulo: "Login",login: "Login" }); // Exibe erro se credenciais inválidas
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.clearCookie('connect.sid');
        res.redirect('/home');
    });
});

module.exports = router;

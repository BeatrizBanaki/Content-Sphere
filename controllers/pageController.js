const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => {
    // Recuperar a lista de páginas
    const pages = list.Pages();
    res.render('index', { pages });
});

// Mostrar o formulário de criação de página
router.get('/create', (req, res) => {
    res.render('create');
});

module.exports = router;

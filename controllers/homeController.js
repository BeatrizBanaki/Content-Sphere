const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pagesDirectory = path.join(__dirname, '../pages'); 
const { listCategories, listPages } = require('./pageController')


router.get('/', (req, res) => {
    let login = 'Login'
    let titulo = "Boas vindas "
    if (req.session.isAuthenticated){
        login = 'Logout';
        titulo += req.session.usuario; 
    }

    const categories = listCategories().map(category => {
        return {
            name: category,
            pages: listPages(category)
        };
    });

    res.render('home', { login: login, titulo: titulo, categories:categories});
});

module.exports = router;

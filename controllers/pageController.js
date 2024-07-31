const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const pagesDirectory = path.join(__dirname, '../pages');

// Função para listar categorias
function listCategories() {
    try {
        const categories = fs.readdirSync(pagesDirectory, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);
        return categories;
    } catch (err) {
        console.error("Erro ao listar categorias:", err);
        return [];
    }
}

// Função para listar páginas dentro de uma categoria
function listPages(category) {
    try {
        const categoryPath = path.join(pagesDirectory, category);
        const files = fs.readdirSync(categoryPath);
        return files.map(file => {
            const pageName = path.parse(file).name;
            return { 
                name: pageName,
                url: `/${category}/${pageName}` 
            };
        });
    } catch (err) {
        console.error("Erro ao listar páginas:", err);
        return [];
    }
}

// Mostrar o formulário de criação de página
router.get('/create', (req, res) => {
    if (req.session.isAuthenticated) {
        const categories = listCategories();
        res.render('create', { categories: categories, login:'Logout', titulo: 'Nova Página' });
    } else {
        res.redirect('/login');
    }
});

// Processar criação de página (POST)
router.post('/create', (req, res) => {
    if (req.session.isAuthenticated) {
        const { url, content, category, newCategory } = req.body;
        const selectedCategory = newCategory || category;
        const categoryPath = path.join(pagesDirectory, selectedCategory);

        if (!fs.existsSync(pagesDirectory)) {
            fs.mkdirSync(pagesDirectory);
        }        

        // Criar nova categoria se não existir
        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath);
        }

        const filePath = path.join(categoryPath, `${url}.txt`);
        
        // Salvar o conteúdo da página em um arquivo
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error("Erro ao criar página:", err);
                return res.status(500).send("Erro ao criar página");
            }
            res.redirect('/home'); 
        });
    } else {
        res.redirect('/login');
    }
});

// Rota para visualizar páginas criadas
router.get('/:category/:pageName', (req, res) => {
    const { category, pageName } = req.params;
    const filePath = path.join(pagesDirectory, category, `${pageName}.txt`);
    let login = 'Login'
    if (req.session.isAuthenticated){
        login = 'Logout';
    }


    // Ler o conteúdo da página e renderizar
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            return res.status(404).send("Página não encontrada");
        }
        res.render('page', { 
            content: content, 
            titulo: pageName, 
            url: `${category}/${pageName}`, 
            login: login,
            autenticado: req.session.isAuthenticated
        });
    });
});

// Mostrar o formulário de edição de página
router.get('/edit/:category/:pageName', (req, res) => {
    if (req.session.isAuthenticated) {
        const { category, pageName } = req.params;
        const filePath = path.join(pagesDirectory, category, `${pageName}.txt`);
        
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                return res.status(404).send("Página não encontrada");
            }
            res.render('edit', { 
                content: content, 
                titulo: 'Editar ' + pageName, 
                category: category, 
                login: 'Logout',
                pageName: pageName
            });
        });
    } else {
        res.redirect('/login');
    }
});

// Processar edição de página (POST)
router.post('/edit/:category/:pageName', (req, res) => {
    if (req.session.isAuthenticated) {
        const { category, pageName } = req.params;
        const { content } = req.body;
        const filePath = path.join(pagesDirectory, category, `${pageName}.txt`);
        
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error("Erro ao editar página:", err);
                return res.status(500).send("Erro ao editar página");
            }
            res.redirect(`/pages/${category}/${pageName}`);
        });
    } else {
        res.redirect('/login');
    }
});

// Processar exclusão de página (POST)
router.get('/delete/:category/:pageName', (req, res) => {
    if (req.session.isAuthenticated) {
        const { category, pageName } = req.params;
        const filePath = path.join(pagesDirectory, category, `${pageName}.txt`);
        
        fs.unlink(filePath, (err) => {
            if (err) {
                console.error("Erro ao excluir página:", err);
                return res.status(500).send("Erro ao excluir página");
            }
            res.redirect('/home');
        });
    } else {
        res.redirect('/login');
    }
});

module.exports = {
    router,
    listCategories,
    listPages
};

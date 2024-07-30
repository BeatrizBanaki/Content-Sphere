const fs = require('fs');
const path = require('path');
const pagesDirectory = path.join(__dirname, '../pages'); // Ajuste o caminho conforme necessário

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

function listPagesInCategory(category) {
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

module.exports = { listCategories, listPagesInCategory };

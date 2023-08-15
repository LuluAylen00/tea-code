const {Router} = require('express');
const app = Router();
const mainController = require('../controllers/mainController');

app.get('/', mainController.index);

app.get('/test', (req, res) => {
    res.render('waiting')
})

module.exports = app;
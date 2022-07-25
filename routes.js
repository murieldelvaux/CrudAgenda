const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController')

const {loginRequired} = require('./src/middlewares/middleware')

// Rotas da home
route.get('/', homeController.index);

//rotas de login
route.get('/login/index', loginController.index)
route.post('/login/register', loginController.register)
route.post('/login/login', loginController.login)
route.get('/login/logout', loginController.logout)

//rota de contato
route.get('/contato/index', loginRequired, contatoController.index) // se eu quero que essa página não esteja acessível para quem não está logado eu devo 
route.post('/contato/register', loginRequired, contatoController.register) 
route.get('/contato/index/:id', loginRequired, contatoController.editIndex) 

//rota de contato para editar contato
route.post('/contato/edit/:id', loginRequired, contatoController.edit) 

//rota para deletar contato
route.get('/contato/delete/:id', loginRequired, contatoController.delete) 

/* GET search page. */
route.get('/query?=/:value', contatoController.search);



module.exports = route;
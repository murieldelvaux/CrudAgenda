//preciso dos contatos aqui para conseguir listar e deletar
const Contato = require('../models/ContatoModel')

exports.index = async (req, res) => {
  const contatos = await Contato.buscaContatos()
  //dentro de render, eu posso mandar dados dentro de um objeto
  res.render('index', {contatos});
};
  

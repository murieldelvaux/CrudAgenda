const mongoose = require('mongoose');
const validator = require('validator');

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: '' },
  email: { type: String, required: false, default: '' },
  telefone: { type: String, required: false, default: '' },
  criadoEm: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model('Contato', ContatoSchema);

function Contato(body) {
  this.body = body;
  this.errors = [];
  this.contato = null;
}

Contato.prototype.register = async function() {
  this.valida();
  if(this.errors.length > 0) return;
  this.contato = await ContatoModel.create(this.body); //criando na base de dados um contato com os dados enviados no corpo da req
};

Contato.prototype.valida = function() {
  this.cleanUp();

  // Validação
  // O e-mail precisa ser válido
  if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
  if(!this.body.nome) this.errors.push('Nome é um campo obrigatório.');
  if(!this.body.email && !this.body.telefone) {
    this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone.');
  }
};

Contato.prototype.cleanUp = function() {
  for(const key in this.body) {
    if(typeof this.body[key] !== 'string') {
      this.body[key] = '';
    }
  }

  this.body = {
    nome: this.body.nome,
    sobrenome: this.body.sobrenome,
    email: this.body.email,
    telefone: this.body.telefone,
  };
};

Contato.prototype.edit = async function(id){
  if(typeof id !=='string') return;
  // se for string eu checko na base de dados
  this.valida()
  if(this.errors.length>0) return;
  this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, {new: true}) // para receber dados atualizados

}
//não está atrelado ao prototype, função estática
// Métodos estáticos --> são aqueles que não vão para o prototype
Contato.buscaPorId = async function(id) {
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.findById(id);
  return contato;
};
Contato.buscaContatos = async function() {
  const contato = await ContatoModel.find()
    .sort({criadoEm: -1}) //1- ordem crescente e -1 p/ ordem decrecente
  return contato;
};


Contato.delete = async function(id) {
  if(typeof id !== 'string') return;
  //const contato = await ContatoModel.findByIdAndDelete(id) ou posso fazer por filtro
  const contato = await ContatoModel.findOneAndDelete({_id:id})
  return contato;
};

Contato.search = async function(name){
  if(typeof id !== 'string') return;
  const contato = await ContatoModel.find({nome:name})
  console.log('---', contato)
  return contato;
}

module.exports = Contato;
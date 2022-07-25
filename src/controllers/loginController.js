//importando loginModel
const Login = require('../models/LoginModel')

exports.index =(req,res)=>{
    //aqui iremos renderizar o arquivo de login
    if(req.session.user) return res.render('login-logado')
    res.render('login')
}
//aqui também será async e await pois o método register da classe login está como async e await
exports.register = async function(req, res) {
    try {
      //instanciando a classe
      const login = new Login(req.body);
      await login.register();//registrando o usuario
      
      //se tiver algum erro na etapa de cadastro, vai mostrar o erro 
      if(login.errors.length > 0) {
        req.flash('errors', login.errors);
        req.session.save(function() {
          console.log(req.session)
          return res.redirect('index');
        });
        return;
      }
  
      req.flash('success', 'Seu usuário foi criado com sucesso.');
      req.session.save(function() {
        console.log(req.session)
        return res.redirect('back');
      });
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
};

exports.login = async function(req, res) {
  try {
    //instanciando a classe
    const login = new Login(req.body);//vai pegar o corpo da requisição e mandar para a classe
    await login.login();//vai mandar os valores para as respectivas chaves da classe

    if(login.errors.length > 0) {
      req.flash('errors', login.errors);
      req.session.save(function() {
        return res.redirect('index');
      });
      return;
    }

    req.flash('success', 'Você entrou no sistema.');
    //jogar o usuário p/ dentro da sessão
    req.session.user = login.user;
    req.session.save(function() {
      console.log(req.session)
      return res.redirect('back');
    });
  } catch(e) {
    console.log(e);
    return res.render('404');
  }
};

exports.logout = function(req, res) {
  req.session.destroy();//vai encerrar a sessão
  res.redirect('/');
};
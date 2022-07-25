const Contato = require('../models/ContatoModel')

//preciso de um controller para redirecionar para a rota que eu quero 
exports.index = (req,res)=>{
    //aqui eu renderizo algo para a rota de /contato/index
    res.render('contato',{
        contato:{}
    }); //aqui eu passo o nome do arquivo ejs que eu quero renderizar na minha rota /contato/index
}

/*
    A função register não vai mostrar nada na tela, ela só vai receber os dados e salvar na base de dados e voltar para alguma página, 
    ou redirecionar para alguma página
*/
exports.register = async(req, res) => {
    try {
      const contato = new Contato(req.body);
      await contato.register();
  
      if(contato.errors.length > 0) {
        req.flash('errors', contato.errors);
        req.session.save(() => res.redirect('/contato/index/'));
        return;
      }
  
      req.flash('success', 'Contato registrado com sucesso.');
      req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
      return;
    } catch(e) {
      console.log(e);
      return res.render('404');
    }
};

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');
  
    const contato = await Contato.buscaPorId(req.params.id);
    if(!contato) return res.render('404');
  
    res.render('contato', { contato });
};

exports.edit = async function(req, res){
    try{
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body); //como se estivessemos criando o contato
        await contato.edit(req.params.id)
    
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect('back'));
            return;
        }
      
        req.flash('success', 'Contato editado com sucesso.');
        req.session.save(() => res.redirect(`/contato/index/${contato.contato._id}`));
        return;
    }catch(e){
        console.log(e);
        res.render('404')
    }
   
}

exports.delete = async function(req,res){
    if(!req.params.id) return res.render('404');
  
    const contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404');
  
    req.flash('success', 'Contato apagado com sucesso.');
    req.session.save(() => res.redirect('back'));
    return;
}

exports.search = async function(req,res){
    console.log('--> test',req,res)
    
    const button = document.querySelector('.pesquisa')
    const inputPesquisa = document.querySelector('.inputPesquisa')
    button.addEventListener('click',()=>{
        const contato = Contato.search(inputPesquisa.value)
        console.log('--->',contato)
    })

    req.flash('success', 'Contato apagado com sucesso.');
    res.send('oi')
    return;
}



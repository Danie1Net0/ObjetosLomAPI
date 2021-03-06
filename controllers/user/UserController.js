const User = require('../../models/user/User');
const bcrypt = require('bcryptjs');

module.exports = {
  async index(req, res) {
    try {
      const { page = 1 } = req.query;
      const users = await User.paginate({}, { page: page, limit: 10 });

      return res.json({ data: users, meta: { success: true, message: 'Usuários recuperados com sucesso!' } });
    } catch(error) {
      return res.status(500).json({ meta: { success: false, message: 'Ocorreu um erro inesperado, tente novamente mais tarde.' } });
    }
  }, 

  async show(req, res) {
    try {
      const user = await User.findById(req.params.id);

      if (user != null)
        return res.json({ data: user, meta: { success: true, message: 'Usuário recuperado com sucesso!' } });
      else
        return res.status(404).json({ data: {}, meta: { success: false, message: 'Usuário não encontrado' } });
    } catch(error) {
      return res.status(500).json({ meta: { success: false, message: 'Ocorreu um erro inesperado, tente novamente mais tarde.' } });
    }
  },

  async store(req, res) {
    try {
      const { email } = req.body;
      if (await User.findOne({ email }))
        return res.status(400).json({ meta: { success: false, message: 'Esse endereço de e-mail já se encontra em uso.' } });

      const user = await User.create(req.body);
      user.password = undefined;

      return res.status(201).json({ data: user, meta: { success: true, message: 'Usuário cadastrado com sucesso!' } });
    } catch(error) {
      return res.status(500).json({ meta: { success: false, message: 'Ocorreu um erro inesperado, tente novamente mais tarde.' } });
    }
  },

  async update(req, res) {
    try {
      const data = req.body;
      data.password = await bcrypt.hash(data.password, 10);
      
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (user != null)
        return res.json({ data: user, meta: { success: true, message: 'Usuário atualizado com sucesso!' } });
      else
        return res.status(404).json({ data: {}, meta: { success: false, message: 'Usuário não encontrado' } });
    } catch(error) {
      return res.status(500).json({ meta: { success: false, message: 'Ocorreu um erro inesperado, tente novamente mais tarde.' } });
    }
  },

  async destroy(req, res) {
    try {
      if (await User.findByIdAndRemove(req.params.id) != null)  
        return res.json({ data: {}, meta: { success: true, message: 'Usuário deletado com sucesso!' } });
      else
        return res.status(404).json({ data: {}, meta: { success: false, message: 'Usuário não encontrado' } });
    } catch(error) {
      return res.status(500).json({ meta: { success: false, message: 'Ocorreu um erro inesperado, tente novamente mais tarde.' } });
    }  
  }
};
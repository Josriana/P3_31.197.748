function validar (req, res, next) {
    const status = req.session.status;
    if(status == 'active') next()
    else res.redirect('/login_user');
}

module.exports = validar;
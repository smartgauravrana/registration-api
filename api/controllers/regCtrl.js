module.exports.login = (req, res) => {
    console.log('Login the user');
    console.log(req.body);
    res
    .status(200)
    .json(req.body);

};

module.exports.register = (req, res) => {
    console.log('Registering the user');
    console.log(req.body);

    res
    .status(200)
    .json(req.body);
}
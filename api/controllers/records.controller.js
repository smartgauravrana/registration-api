module.exports.getRecords = (req, res) => {
    console.log('Get the records')
    res
    .status(200)
    .json({
        'message': 'It means you are logged in'
    });
};
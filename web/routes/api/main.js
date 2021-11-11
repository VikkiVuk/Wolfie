const router = require('express').Router()
const backend = require('../../../bot/utility/backend')

router.use("/extdata", require('./extdata'))
router.use("/", function(req, res) {
    res.send({
        "message": "Welcome to the API.",
        "status": "OK"
    })
})


module.exports = router
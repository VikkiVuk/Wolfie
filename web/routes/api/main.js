const router = require('express').Router()
const backend = require('../../../bot/utility/backend')

router.use("/extdata", require('./extdata'))
router.use("/accounts", require("./accounts"))
router.use("/", function(req, res) {
    res.send("OK")
})


module.exports = router
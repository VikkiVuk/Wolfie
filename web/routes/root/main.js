const router = require('express').Router()

router.use("/privacy-policy", require("./privacypolicy"))

router.use("/", function(req, res) {
    res.send(`Under construction.`)
})

module.exports = router

const router = require('express').Router()

router.get("/", function(req, res) {
    res.send(200)
})

module.exports = router
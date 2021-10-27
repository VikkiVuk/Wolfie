const router = require('express').Router()

router.use("/", function(req, res) {
    res.send({
        "message": "Welcome to the API.",
        "status": "OK"
    })
})


module.exports = router
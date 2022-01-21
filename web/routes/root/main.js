const router = require('express').Router()

router.use("/auth", require('./auth') )
router.use("/discord", require('./discord') )
router.use("/suggest", require('./suggest'))
router.use("/admin-apply", require('./admin-apply'))
router.use("/dashboard", require('./dashboard'))
router.use("/privacy-policy", require("./privacypolicy"))

router.use("/", function(req, res) {
    res.send(`
        <head>
            <title> Dashboard </title>
            <meta name="google-site-verification" content="4G_Fi0-Y_Vb3oJZCs90hsbUkIkn03oR6pgJvCkp4rNY" />
            <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4231389926874940" crossorigin="anonymous"></script>
            <meta content="Wolfie Hub" property="og:title" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta content="The wolfie main site, the hub for everything Wolfie.." property="og:description" />
            <meta content="https://wolfie.vikkivuk.xyz/main" property="og:url" />
            <meta content="" property="og:image" />
            <meta content="#087CF0" data-react-helmet="true" name="theme-color" />
        </head>
        <body style="background-color:rgba(0, 0, 0, 0.829);">
                <div id="container">
                    <div style="position: absolute;background-color: white; margin-top: 30px;margin-right: 600px;margin-left: 500px;border-radius: 25px;width: 1000px;">
                        <center>
                            <h1 style="font-family: Arial, Helvetica, sans-serif;">Hello There!</h1>
                        </center>
                    </div>
                    <div id="center" style="position: absolute; margin-top: 200px;margin-right: 600px;margin-left: 250px;border-radius: 50px;width: 1200px;height: 600px;">
                        <div style="background-color: white;position: absolute; margin-top: 0px;margin-right: 0px;margin-left: 0px;border-radius: 50px;width: 1200px;height: 190px;">
                            <center>
                                <h1 style="font-family: Arial, Helvetica, sans-serif;color:black;">What is Wolfie?</h1>
                                <h2 style="font-family: Arial, Helvetica, sans-serif;color:black;">Wolfie is a phenomenal and very interactive bot for discord, made by VikkiVuk (out of boredom mostly). You have a lot of commands with which you can do whatever you want and if there is something you want a lot on the bot, just click on the button on your left where it says "Suggest".</h2>
                            </center>
                        </div> 
                        <div style="background-color: white;position: absolute; margin-top: 220px;margin-right: 0px;margin-left: 0px;border-radius: 50px;width: 1200px;height: 190px;">
                            <center>
                                <h1 style="font-family: Arial, Helvetica, sans-serif;color:black;">Why Wolfie?</h1>
                                <h2 style="font-family: Arial, Helvetica, sans-serif;color:black;">Wolfie was first Auto VikkiVuk, who was Auto VikkiVuk 1/2/3 and then Wolfie. There was a vote in my server for AV to become something else and we lowered the options to just 3 options: Cucumber, Wolfie, and Wolfy. Wolfy was chosen but discord didn’t let me put that name because too many people had it.</h2>
                            </center>
                        </div>
                        <div style="background-color: white;position: absolute; margin-top: 440px;margin-right: 0px;margin-left: 0px;border-radius: 50px;width: 1200px;height: 230px;">
                            <center>
                                <h1 style="font-family: Arial, Helvetica, sans-serif;color:black;">How was Wolfie created?</h1>
                                <h2 style="font-family: Arial, Helvetica, sans-serif;color:black;">To know how Wolfie came into being we need to know how Auto VikkiVuk (ref. AV) came into being. AV was created first in a program on steam called Discord Bot Studio, I made a lot of commands in it, just so you know there were no slash commands then. And then discord threw out slash commands and I wanted to have slash commands in the bot and then I learned to encode discord.js and that's how AV (s. Wolfie) came about.</h2>
                            </center>
                        </div>
                    </div>
                    <div id="sidebar" style="right: 10px;left: 10px;bottom: 10px; top: 10px;position: absolute;margin-top: 100px;background-color: white;margin-right: 1680px;margin-bottom: 100px;height: 700px;border-radius: 50px;font-family: Arial, Helvetica, sans-serif;color:white;">
                        <button id="btn1_left" onclick='buttonClickPopup("dashboard")' style="cursor:pointer;background-color: rgba(0, 0, 0, 0.829);height: 200px;width: 200px;border-radius: 50px;margin-top: 20px;margin-left: 11px;margin-right: 5px;font-family: Arial, Helvetica, sans-serif;color:white;font-size: xx-large;">Dashboard</button>
                        <br> <br>
                        <button id="btn2_left" onclick='buttonClickPopup("admin-apply")' style="cursor:pointer;background-color: rgba(0, 0, 0, 0.829);height: 200px;width: 200px;border-radius: 50px;margin-top: 10px;margin-left: 11px;margin-right: 5px;font-family: Arial, Helvetica, sans-serif;color:white;font-size: xx-large;">Staff Apply</button>
                        <br> <br>
                        <button id="btn3_left" onclick='buttonClickPopup("suggest")' style="cursor:pointer;background-color: rgba(0, 0, 0, 0.829);height: 200px;width: 200px;border-radius: 50px;margin-top: 10px;margin-left: 11px;margin-right: 5px;font-family: Arial, Helvetica, sans-serif;color:white;font-size: xx-large;">Suggest</button>
                    </div>
                    
                    <div id="right_siderbar" style="position: absolute;margin-top: 200px;background-color: white;margin-left: 1500px;margin-bottom: 200px;height: 200px;width: 410px;border-radius: 15px;font-family: Arial, Helvetica, sans-serif;color:white;">
                      <center>We are working on this part</center>
                    </div>
        </body>

        <script>
            function buttonClickPopup(popup) {
                console.log(window.location)
                window.open(window.location + "/" + popup,'popup','width=600,height=600'); return false;
            }
        </script>
    `)
})

module.exports = router
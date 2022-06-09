const express = require("express")
const app = express()
const router = express.Router()
const path = require("path")
const axios = require("axios")

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


const Client_ID = "XXXXXX-XXXX"
const Client_Secret = "XXXXXX-XXXXX"
let access_token = "";

router.get("/", (req, res) => {
    res.render("index", { Client_ID })
})


router.get("/github/callback", (req, res) => {
    const requestToken = req.query.code
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${Client_ID}&client_secret=${Client_Secret}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
             accept: 'application/json'
        }
      }).then((response) => {

        access_token = response.data.access_token
        console.log(access_token)
        res.redirect('/success');
      })
})

router.get('/success', function(req, res) {
    axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
          Authorization: 'token ' + access_token
        }
      }).then((response) => {
        res.render('success',{ userData: response.data });
      })
  });

app.use("/", router)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server listening at PORT ${PORT}`)
})
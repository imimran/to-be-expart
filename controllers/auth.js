const jwt = require('njwt')

app.get('/verify/:token', (req, res) => {
    //res.send(`TODO: verify this JWT: ${req.params.token}`)

    const { token } = req.params
    jwt.verify(token, 'top-secret-phrase', (err, verifiedJwt) => {
      if(err){
        res.send(err.message)
      }else{
        res.send(verifiedJwt)
      }
    })
  })
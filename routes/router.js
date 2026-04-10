// routes/router.js
const express = require('express');
const router = express.Router();
const MTCaptcha = require('mtcaptcha');
const jwt = require('jsonwebtoken');
const userMiddleware = require('../middleware/user.js');

const captcha = new MTCaptcha({
  privateKey: process.env.MTCAPTCHA_PRIVATE_KEY
});

router.post('/login', async (req, res, next) => {
  if (!process.env.MTCAPTCHA_PRIVATE_KEY) {
    return res.status(500).send({
      msg: 'MTCAPTCHA_PRIVATE_KEY is not configured.'
    });
  }

  if(req.body.password != "test" || req.body.username != "test"){
    return res.status(401).send({
      msg: 'Username or password is incorrect!'
    });
  }
  if(req.body.verifiedtoken == ""){
    return res.status(401).send({
      msg: 'Captcha is required!'
    });
  }

  const tokenValidationResponse = await captcha.verify(req.body.verifiedtoken);

  if(tokenValidationResponse.success){
      const token = jwt.sign({
          username: "MTCaptcha",
          userId: 1
        },
        'SECRETKEY', {
          expiresIn: '7d'
        }
      );
      return res.status(200).send({
        msg: 'Logged in!',
        token,
        user: {username:"MTCaptcha"}
      });
  }

  return res.status(401).send({
    msg: tokenValidationResponse.fail_codes?.length
      ? Object.values(tokenValidationResponse.fail_codes[0]).toString()
      : 'Captcha verification failed.'
  });

});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});


module.exports = router;
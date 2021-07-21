// routes/router.js
const express = require('express');
const router = express.Router();
const MTCaptchaLib = require('mtcaptcha').MTCaptcha;
const jwt = require('jsonwebtoken');
const userMiddleware = require('../middleware/user.js');
const MTCaptchaConfig = require('../config/config.json');


router.post('/login', (req, res, next) => {

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
  // Add your site private key here, you can get it from the sites page of MTCaptcha admin site.
  const mtcapInstance = new MTCaptchaLib(MTCaptchaConfig['MTCAPTCHA_PRIVATE_KEY'],req.body['verifiedtoken']);
  mtcapInstance.verify(function (tokenValidationResponse) {
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
    }else{
      return res.status(401).send({msg: Object.values(tokenValidationResponse.fail_codes[0]).toString()});
    }
  });


});

router.get('/secret-route', userMiddleware.isLoggedIn, (req, res, next) => {
  res.send('This is the secret content. Only logged in users can see that!');
});


module.exports = router;
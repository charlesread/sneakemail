# Sneakemail

Ever wonder how companies like _Constant Contact_ or _MailChimp_ track when somebody opens one of their emails?  It's pretty neat, and _Sneakemail_ effectively recreates it, although probably in a less robust way.

Nevertheless, _Sneakemail_ will allow you to send emails and know when those emails have been opened.

## Moving Parts

_Sneakemail_ consists of an **API** and a [soon to come] **UI**.

### API

The API uses _Hapi_, to handle the endpoints, and _nodemailer_, to send emails.  During configuration you have direct access to both of these modules, so you can manipulate them however you lke.

By default, the _Sneakemail_ API will create the two endpoints:

#### `/email [POST]`
	
This endpoint cab be used to send an email, and inject into that email the sneaky bit: that which allows you to track when an email has been opened.  You, or your application, make an HTTP POST to this endpoint with a body like the following:

```json
{
	"to":"recipient@domain.com",
    "fromName": "Frank Foo",
    "subject": "Super Important Meeting",
    "text": "blah blah bar",
    "html": "<p>blah blah bar</p>",
    "passthrough": {
    	"username": "ffoo",
        "emailId": 1234567
    }
}
```

The _Sneakemail_ API will then send an email to `to` and appends a `<link rel="stylesheet" ... >` tag to the `html`.  The `href` attribute of the `<link />` tag will be a URL that that is seemingly the location of a CSS file.  But it's not a real CSS file, before the _Sneakemail_ API sends the email it encrypts the `passthrough` object that was posted to `/email` and that encrypted string becomes the name of the CSS file referenced in the `<link>`'s `href` attribute (the name of the CSS file becomes the `slug` in the endpoint below.
    
#### `/{slug}.css [GET]`

This is how the tracking works.  When an email client downloads the CSS file in the body of the email this endpoint decrypts the encrypted `slug` (name of the CSS file), and now has complete access to the `passthrough` object that was POSTed to `/email`.

### UI

### Usage

Install `sneakemail`

```
npm install --save sneakemail
```

```javascript
'use strict'

const path = require('path')
const co = require('bluebird-co').co

const Sneakemail = require('sneakemail')
const api = Sneakemail.api
const ui = Sneakemail.ui

const options = {
  // the api object gets passed DIRECTLY to the Hapi `server.connection()` method
  server: {
    api: {
      port: 3000
    }
  },
  // these values need to be entered accodeing to `node-mailer`: https://nodemailer.com/smtp/well-known,
  // this object is passed DIRECTLY to nodemailer.createTransport(), so do whatever you like according to what
  // `node-mailer` does, you, of course, don't have to use a "well-known" service, as this example does
  transporter: {
    service: 'Mailjet',
    auth: {
      user: '',
      pass: ''
    }
  },
  // this becomes the from address in the email that is sent
  sneakemail: {
    fromAddress: 'email@gmail.com',
    endpoints: {
      api: {
        emailPost: '/email' //default
      },
      ui: {
        index: '/', //default
        emailPost: '/email' //default
      }
    }
  },
  // this is the function that gets called when somebody opens an email, its argument is an object that contains the
  // `to`, `subject`, and `passthrough` objects that were contained in the body of the HTTP POST to `/email`
  openCallback: function (obj) {
    console.log(obj)
  }
}

co(function *() {

  yield api.init(options)
  yield ui.init(options)

  // add some more routes if you so desire
  api.server.route({
    method: 'get',
    path: '/',
    handler: (req, reply) => {
      reply('Welcome to the Sneakemail API')
    }
  })

  yield api.start()
  yield ui.start()

})
  .then(() => {
    console.log('api started at ', api.server.info.uri)
    console.log('ui started at ', ui.server.info.uri)
    // lets look at the route table just to confirm that our routes are regisred
    console.log('api routes:')
    api.server.table()[0].table.map((t) => {
      console.log(' route %s [%s] is registered: %s%s', t.path, t.method, api.server.info.uri, t.path)
    })
    console.log('ui routes:')
    ui.server.table()[0].table.map((t) => {
      console.log(' route %s [%s] is registered: %s%s', t.path, t.method, ui.server.info.uri, t.path)
    })
  })
  .catch(console.error)
```

Will output something like

```
api started at  http://10.0.0.167:3000
ui started at  http://10.0.0.167:8080
api routes:
 route /email [post] is registered: http://10.0.0.167:3000/email
 route /{slug}.css [get] is registered: http://10.0.0.167:3000/{slug}.css
 route / [get] is registered: http://10.0.0.167:3000/
ui routes:
 route / [get] is registered: http://10.0.0.167:8080/
 route /{param*} [get] is registered: http://10.0.0.167:8080/{param*}
 route /static/{param*} [get] is registered: http://10.0.0.167:8080/static/{param*}
 route /email [post] is registered: http://10.0.0.167:8080/email
 ```

Now make a POST to `/email`, wait for the email to come, open it, and check your console!

Or browse to the `/` `ui` endpoint `http://10.0.0.167:8080/`.
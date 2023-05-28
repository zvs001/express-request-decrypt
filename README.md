
Decryption middleware for express. 

[![npm](https://img.shields.io/npm/v/express-request-decrypt)](https://www.npmjs.com/package/express-request-decrypt)

At the moment library decrypts only body from requests.

## Install

``yarn add express-request-decrypt``

or 

```npm i -S express-request-decrypt```

#### express setup

Make sure you accept text/plain content data.
```ts
import bodyParser from 'body-parser'

const app = express.Router()

app.use(bodyParser.text())
```

## Usage

Code example:

```tsx
import compareVersion from 'compare-versions'
import CryptoJS from 'crypto-js'
import express from 'express'
import { createDecryptMiddleWare } from 'express-request-decrypt'

const app = express.Router()

app.use(createDecryptMiddleWare({
  allowNotEncrypted: process.env.NODE_ENV === 'test',
  onDecrypt(encTxt) {
    return CryptoJS.AES.decrypt(encTxt, 'secret').toString(CryptoJS.enc.Utf8)
  },
  isEncryptionRequired(req) {
    // (optional) if you need to disable for some requests
    const appVersion = req.headers['app-version']
    const diff = compareVersion(appVersion, '1.0')
    return diff >= 0 // starting from 1.0
  },
}))

```


Works with:

- [axios-encrypt](https://www.npmjs.com/package/axios-encrypt)

import express from 'express'
import _ from 'lodash'
import invariant from 'invariant'

interface ExpressRequestDecryptParams {
  onDecrypt(encTxt: string): string
  allowNotEncrypted?: boolean
  isEncryptionRequired?(req: express.Request): boolean
}

export const createDecryptMiddleWare = (params: ExpressRequestDecryptParams):
  express.RequestHandler => (req, res, next) => {
  const { isEncryptionRequired, onDecrypt, allowNotEncrypted } = params
  const { body, method } = req
  if (_.isEmpty(body)) return next()

  if (!['POST', 'UPDATE'].includes(method.toUpperCase())) return next() // no body param for other types anyway

  if (_.isObject(body)) {
    if (isEncryptionRequired && isEncryptionRequired(req)) {
      return res.status(500).send({ error :'Processing is not accepted.' })
    }

    if(allowNotEncrypted) {
      return next()
    } else {
      return res.status(500).send({ error: 'Raw body is not allowed' })
    }
  } // for case when client send content-type: json

  let decrypted = onDecrypt(body)
  invariant(typeof decrypted === 'string', '[express-request-decrypt] decrypted text must be a string')

  req.body = JSON.parse(decrypted) // we expect that server works with content-type json

  next()
}

export default {
  createDecryptMiddleWare,
}

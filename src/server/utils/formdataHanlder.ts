import { Request } from 'express'
import formidable from 'formidable'

export default function hanlder(req: Request, uploadDir: string) {
  return new Promise((res, rej) => {
    const form = new formidable.IncomingForm()
    form.encoding = 'binary'
    form.uploadDir = uploadDir
    form.keepExtensions = true

    form.parse(req, (err, fields, files) => {
      if (err) {
        rej(err)
      }
      res({ fields, files })
    })
  })
}
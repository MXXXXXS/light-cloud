import express, {
  Request,
  Response
} from 'express'
import path from 'path'
import fs from 'fs'

const app = express()
const appPort = 80
const uploadDir = path.resolve(__dirname, 'uploadDir')

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir)

interface Router {
  [urlPath: string]: {
    method: string,
    hanlder: (req: Request, res: Response) => void
  }[]
}

const router: Router = {
  '/': [{
    method: "POST",
    hanlder: (req, res) => {

    }
  }, {
    method: "GET",
    hanlder: (req, res) => {
      res.send('Hello, from server')
    }
  }],
  '/upload': [{
    method: "POST",
    hanlder: (req, res) => {
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Headers', "*")

      const file = fs.createWriteStream(
        path.resolve(uploadDir, req.query.name), {
          encoding: 'binary'
        }
      )

      file.on('error', () => {
        res.status(202)
        res.send()
      })
      
      file.on('finish', () => {
        console.log('已接收文件: ' + req.query.name)
        res.status(201)
        res.send()
      })

      req.pipe(file)
    }
  }, {
    method: "OPTIONS",
    hanlder: (req, res) => {
      res.set('Access-Control-Allow-Origin', '*')
      res.set('Access-Control-Allow-Headers', "*")
      res.set('Access-Control-Allow-Methods', "GET,POST,PUT")
      res.status(200)
      res.send()
    }
  }, {
    method: "GET",
    hanlder: (req, res) => {
      res.send('Hello, from server')
    }
  }]
}

for (const urlPath in router) {
  if (router.hasOwnProperty(urlPath)) {
    const pathDetails = router[urlPath];
    pathDetails.forEach(config => {
      app[config.method.toLowerCase()](urlPath, config.hanlder)
    });
  }
}

app.listen(appPort, () => {
  console.log('Server listening...')
})
import express = require('express')
import { MetricsHandler } from './metrics'

var bodyparser = require('body-parser')

const app = express()
const port: string = process.env.PORT || '8081'


///path
const path = require('path')
app.use(express.static(path.join(__dirname, 'public')))

//views
app.set('views', __dirname + "/views")
app.set('view engine', 'ejs');

app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

app.get('/', function (req, res) {    //menu
  res.write('Welcome in the first App : '+
  'path \'/hello\' to display the -hello name- mode.\n\n'+
  ' Path to be completed with parameter NAME :\n'+
  'it displays \'hello name\' \n'+
  'if no name : \'hello anonymous\''+
  'else : error 404')
  res.end()
})


app.get(    //helloanonymous page
'/hello', 
(req, res) => res.send("hello anonymous")
)

app.get(    //hello name page
  '/hello/:name', 
  (req, res) => res.render('hello.ejs' ,{name: req.params.name})
  
)

const dbMet: MetricsHandler = new MetricsHandler('./db/metrics')

// post fct (all)
app.post('/metrics/:id', (req: any, res: any) => {
  dbMet.save(req.params.id, req.body, (err: Error | null) => {
    if (err) throw err
    res.status(200).send()
  })
})
///////////

// get fct (all)
app.get('/metrics', (req: any, res: any) => {
  dbMet.getAll((err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.end(JSON.stringify(result))
  })
})
//////////

// get fct (one)
app.get('/metrics/:id', (req: any, res: any) => {
  dbMet.getOne(req.params.id, (err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.end(JSON.stringify(result))
    //res.json(result)
  })
})
//////////
//////////

// delete fct (one)
app.delete('/metrics/delete/:id', (req: any, res: any) => {
  dbMet.delOne(req.params.id, (err: Error | null, result?: any) => {
    if (err) {
      throw err
    }
    res.end(JSON.stringify(result))
    //res.json(result)
  })
})
//////////




app.listen(port, (err: Error) => {
  if (err) {
    throw err
  }
  console.log(`server is listening on port ${port}`)
})
const express = require('express')
var cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;

app.use(cors())

const toydata =  require('./data/toyData.json');

app.get('/', (req, res) => {
  res.send('Hello Toy World!')
})

app.get('/toys', (req, res) => {
  res.send(toydata);
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})



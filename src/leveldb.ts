import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'

/*const db = levelup(encoding(
  leveldown("path"), 
  { valueEncoding: 'json' })
)

db.put(key, value, (err) => {
    if(err) {...}
})


db.get(key, (err, value) => {
    if(err) {...}
})
*/


import fs = require('fs')
import del = require('del')

export class LevelDB {
  static open(path: string) {
    const encoded = encoding(leveldown(path), { valueEncoding: 'json' })
    return levelup(encoded)
  }

  static clear(path: string) {
    if (fs.existsSync(path)) {
      del.sync(path, { force: true })
    }
  }
}


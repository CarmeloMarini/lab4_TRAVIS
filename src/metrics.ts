import {LevelDB} from "./leveldb"
import WriteStream from  "level-ws"
import ReadStream from  "level-ws"
import { isBuffer, callbackify } from "util"

export class Metric {
  public timestamp: string
  public value: number

  constructor(ts: string, v: number) {
    this.timestamp = ts
    this.value = v
  }
}

export class MetricsHandler {
  public db: any 
  constructor(dbPath: string) {
    this.db = LevelDB.open(dbPath)
  }
  
  ////GET ONE
  public getOne(id,callback: (error: Error | null, result?: Metric[]) => void) {
    var result = new Array();
    const rs = this.db.createReadStream()
        .on('data', function (data) {
          result.push(data)
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          console.log('Stream closed')
        })
        .on('end', function () {
          var resultBis;
          for(var i=0; i<result.length; i++){
            var temp= new Array()
            temp=result[i].key.split(":")
            if (temp[1]==id){
              resultBis=result[i]
            }
            
          }
          callback(null, resultBis);
          console.log('Stream ended')

        })
  }
  
  ////GET ALL
  public getAll(callback: (error: Error | null, result?: Metric[]) => void) {
    var result = new Array();
    const rs = this.db.createReadStream()
        .on('data', function (data) {
          result.push(data)
        })
        .on('error', function (err) {
          console.log('Oh my!', err)
        })
        .on('close', function () {
          console.log('Stream closed')
        })
        .on('end', function () {
          console.log('Stream ended')
          callback(null, result);

        })
  }


  ////lab 3

  public save(key: number, metrics: Metric[], callback: (error: Error | null) => void) {
    const stream = WriteStream(this.db)
    stream.on('error', callback)
    stream.on('close', callback)
    metrics.forEach((m: Metric) => {
      stream.write({ key: `metric:${key}:${m.timestamp}`, value: m.value })
    })
    stream.end()
  }

  ////Delete

  public delOne(id: string, callback : (error : Error |null) => void) {

    this.db
      .del(id, (err: Error) => {
        if(err){
          console.log('Error finding')
          callback(err)
          return
        }
        console.log('Element deleted')
          callback(err)
      })
  }



}

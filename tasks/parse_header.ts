import fs from "fs"
import { task, types } from 'hardhat/config';
import type { HardhatRuntimeEnvironment, Libraries } from 'hardhat/types';
import { ethers } from "ethers";;
import os from "os"

task('bh', 'block header parse')
  .addOptionalParam('beg', 'begin block number', 1, types.int)
  .addOptionalParam('outfile', 'result output file', "./res.txt", types.string)
  .setAction(block_header_parse)


var url: string

async function block_header_parse(
  args: {
    beg: number,
    outfile: string
  },
  hre: HardhatRuntimeEnvironment
) {   
  url = hre.userConfig.networks![hre.network.name].url!
  console.log("HTTP URL: ", url)
  var beg = args.beg
  var outfile = args.outfile

  const provider = new ethers.providers.JsonRpcProvider(url)
 
  try {
    var blkNum = await provider.getBlockNumber()
    if (!blkNum) {
      throw String("block number get error")
    }

    console.log(blkNum)

    if (beg > blkNum) {
      return
    }

    console.log("block header parse begin")

    for (let i = beg; i < blkNum; i++) {
      var blk: ethers.providers.Block = await provider.getBlock(i)
      console.log("block num:", i)
      console.log("block:", blk)

      if (!blk) {
        continue
      }

      var timestamp = blk.timestamp
      if (String(timestamp).length === 10) {
        timestamp = timestamp * 1000
      }
      var date = new Date(timestamp)
      var day_num = date.getDate()
      var day: string = ""
      if (day_num < 10) {
        day = "0" + day_num.toString()
      } else {
        day = day_num.toString()
      }

      var month_num = date.getMonth() + 1
      var month: string = ""
      if (month_num < 10) {
        month = "0" + month_num.toString()
      } else {
        month = month_num.toString()
      }
      
      var year: string = date.getFullYear().toString()

      var time = day + "/" + month + "/" + year
      console.log(time)
      console.log(blk.transactions.length)
      var froms: string = ""
      var tos: string = ""
      var txNum: number = 0

      if (blk.transactions.length > 0) {
        for (let txHash of blk.transactions) {
          var tx = await provider.getTransaction(txHash)
          var txReceipt = await provider.getTransactionReceipt(txHash)

          if (!tx || !txReceipt) {
            continue
          }

          console.log("transaction:", tx)
          console.log("transaction receipt:", txReceipt)
          // if (txReceipt.status === 0) {
          //   continue
          // }

          // txNum++

          var from = tx.from
          var to = tx.to
          var status = txReceipt.status

          if (from && from.length > 0) {
            froms = froms + from + ","
          }
          else {
            from = "0x"
          }

          if (to && to.length > 0) {
            tos = tos + to + ","
          } else {
            to = "0x"
          }

          var res = i + "|" + txHash + "|" + status + "|" + timestamp + "|" + time + "|" + blk.transactions.length + "|" + from + "|" + to
          console.log(res)
          fs.writeFileSync(outfile, res + os.EOL, { flag: "a" })

        }
      }

      // if (txNum > 0) {
      //   var res = i + "|" + time + "|" + blk.transactions.length + "|" + froms + "|" + tos
      //   console.log(res)
      //   fs.writeFileSync(outfile, res + os.EOL, { flag: "a" })
      // }

      blkNum = await provider.getBlockNumber()
      if (!blkNum) {
        throw String("block number get error")
      }
      console.log(blkNum)

      // await sleep(10)
    }
    
    console.log("block header parse end")
  } catch (err) {
    console.log("error: ", err)
  }
}




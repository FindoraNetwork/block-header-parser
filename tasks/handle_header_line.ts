
import fs from "fs"
import { task, types } from 'hardhat/config';
import type { HardhatRuntimeEnvironment } from 'hardhat/types';
import os from "os"
import { createInterface } from "readline/promises";

task('hl', 'handle header lines')
  .addOptionalParam('infile', 'header line input file', "./res100.txt", types.string)
  .addOptionalParam('outfile', 'result output file', "./res1000.txt", types.string)
  .setAction(handle_block_line)



async function handle_block_line(
    args: {
        infile: string,
        outfile: string
    },
  hre: HardhatRuntimeEnvironment
) {   
    let infile = args.infile
    let outfile = args.outfile


    try {
        let rl = createInterface({
            input : fs.createReadStream(infile),
            output : process.stdout,
            terminal: false
        });
        
        console.log("handle header line begin")

        let lines: Set<string> = new Set()
        // let line = await rl.question("")
        // console.log(line)
        for await (const line of rl) {
            lines.add(line)
        }

        let split_datas = new Map()
        for (let line of lines) {
            let arr_data = line.split("|")
            let date: string = arr_data[4]
            let datas = split_datas.get(date)
            let data = {
                blkNum: arr_data[0],
                txHash: arr_data[1],
                status: arr_data[2],
                timestamp: arr_data[3],
                blkTxNum: arr_data[5],
                fromAddr: arr_data[6],
                toAddr: arr_data[7],
            }
     
            if (!datas) {
                datas = [data]
                split_datas.set(date, datas)
            } else {
                datas.push(data)
                split_datas.set(date, datas)
            }

        }

        let total_addr: Set<string> = new Set()
        let res_datas = new Map()

        for (let [date, datas] of split_datas) {
            let active_addr: Set<string> = new Set()
            let new_addr: Set<string> = new Set()
            for (let data of datas) {
                // console.log("key: ", date, "v: ", data)

                if (!total_addr.has(data.fromAddr)) {
                    new_addr.add(data.fromAddr)
                }
                if (
                    !(data.toAddr === "0x") &&
                    !total_addr.has(data.toAddr)
                ) {
                    new_addr.add(data.toAddr)
                }

                active_addr.add(data.fromAddr)
                if (!(data.toAddr === "0x")) {
                    active_addr.add(data.toAddr)
                }

                total_addr.add(data.fromAddr)
                if (!(data.toAddr === "0x")) {
                    total_addr.add(data.toAddr)
                }
            }

            res_datas.set(date, {
                txLen: datas.length,
                activeAddr: active_addr,
                newAddr: new_addr,
            })

            // console.log("date: ", date,
            //     "txLen: ", datas.length,
            //     "activeAddr: ", active_addr.size,
            //     "newAddr: ", new_addr.size,)
        }


        for (let [date, datas] of res_datas) {
            // console.log(date, datas.txLen, datas.activeAddr, datas.newAddr)
            let res = date + "|" + datas.txLen + "|" + datas.activeAddr.size + "|" + datas.newAddr.size
            console.log(res)
            fs.writeFileSync(outfile, res + os.EOL, { flag: "a" })
        }

        console.log("handle header line end")
    } catch (err) {
        console.log("error: ", err)
    }
}




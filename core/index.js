const fs = require('fs');
const os = require('os-utils')
const request = require('request')
const async = require('async')
const ProgressBar = require('progress')
import {PythonShell} from 'python-shell';

var dir = './tmp';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

class Downloader {
    constructor() {
        this.q = async.queue(this.singleFile, 1);

        // assign a callback
        this.q.drain(function() {
            console.log('all items have been processed');
        });

        // assign an error callback
        this.q.error(function(err, task) {
            console.error('task experienced an error', task);
        });
    }

    downloadFiles(links, dirs) {
        console.log('Downloading ', links)
        for (let link of links) {
            this.q.push(link);
        }
    }

    singleFile(link, tdir) {
        let file = request(link);
        let bar;
        file.on('response', (res) => {
            const len = parseInt(res.headers['content-length'], 10);
            bar = new ProgressBar('  Downloading [:bar] :rate/bps :percent :etas', {
                complete: '=',
                incomplete: ' ',
                width: 20,
                total: len
            });
            file.on('data', (chunk) => {
                bar.tick(chunk.length);
            })
            file.on('end', () => {
                console.log('Downloaded');
            })
        })
        file.pipe(fs.createWriteStream(tdir))
    }
}


export const _deps_install = {
    python3: async(callback) => {
        switch (os.platform()) {
            case 'linux':{
                require('child_process').exec('sudo apt install python3 python3-pip --assume-yes', (err, stdout) => {
                    if(err) console.log(err)
                    console.log(stdout);
                }) 
            }
            case 'win32':{
                const temp_dir =`${dir}/python3`
                const dl_object = `${process.cwd()}/${temp_dir}/python3.exe`
                
                if (!fs.existsSync(temp_dir)){
                    fs.mkdirSync(temp_dir)
                }
                if(!fs.existsSync(dl_object)){
                    console.log('Downloading Python...')
                    const dl = new Downloader();
                    await dl.singleFile("https://www.python.org/ftp/python/3.8.2/python-3.8.2.exe", dl_object)
                }
                console.log(dl_object)
                require('child_process').exec(dl_object , function (err, stdout) {
                    console.log('Starting Setup Python...')
                    if(err){
                        return callback(true, err)
                    }
                   
                    callback(false, stdout)
                    return true
                    
                });

                return true
            }
            default:{
                console.error('Detected => ' + os.platform() + ' | Your operating system is compatible...')
                throw new Error;
            }
                
        }

    }
}

export const app = {
    setup: async () => {
        console.log('Installing all dependencies...')
        await _deps_install.python3(callback =>{
            console.log(callback)
        })
    },
    init: () => {
        // Check if depedencies is installed
        // require('child_process').exec('python3 ', function (err, stdout) {
        //     if(err) {
        //         console.log(err)
        //         app.setup()
        //     }
        //     console.log(stdout);
        // });
    }
}


export const _$ = {
    getClients: ( callback, payload ) => {
        if(!payload)return false
        const { mac, channel, _interface } = payload
        let _$options = {
            mode: 'text',
            encoding: 'utf8',
            scriptPath: `${process.cwd()}/py_scripts/`,
            args: [mac, channel, _interface]
          };
          
        return callback(new PythonShell('network_listen.py', _$options))
    }
}
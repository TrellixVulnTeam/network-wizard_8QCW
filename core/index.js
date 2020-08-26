const fs = require('fs');
const path = require('path')
const os = require('os-utils')
const request = require('request')
const async = require('async')
const ProgressBar = require('progress')
const { SetupController } = require('../renderer/controllers/_initInstallDeps.jsx')
const React = require('react')
const ReactDOM = require('react-dom')
const stackTrace = require('stack-trace')
const LocalStorage = require('node-localstorage').LocalStorage;
const frs = new LocalStorage("./scratch");

var dir = './tmp';
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}

export const verbosity = {
  debug: (...cont) => {
    const frame = stackTrace.get()[1]
    // const line = frame.getLineNumber()
    // const file = path.basename(frame.getFileName())
    const method = frame.getFunctionName()

    return console.debug(`%c[${method}]`, 'color: #bada55', ...cont)
  },
  error: (...cont) => {
    const frame = stackTrace.get()[1]
    // const line = frame.getLineNumber()
    // const file = path.basename(frame.getFileName())
    const method = frame.getFunctionName()

    return console.error(`%c[${method}]`, 'color: #bada55', ...cont)
  },

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
        return new Promise(resolve => {
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
                    verbosity.debug('Downloaded');
                    resolve(true)
                })
            })
            file.pipe(fs.createWriteStream(tdir))
        })
    }
}

export async function _initInstallDeps(){
    frs.setItem('src', false)
    const contents = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'requirements.json'), 'utf8'))
    console.log('🛠 Installing runtime deps => ',contents);
    ReactDOM.render(
        React.createElement(SetupController, { deps: contents }),
        document.getElementById('app_modals')
    )
}


function matchExecutableExtension(os){
    if (!os) return false
    switch (os) {
        case "win32": return "exe"
        case "linux": return "bruh"
        default: return "bin"
    }
}

const _methodsControllers = {
    httpDownload: async (e, callback) => {
        if (!e.payload) {
            return false
        }

        const filename = e.filekey || Math.random()
        const fileExtension = (/[.]/.exec(e.payload)) ? /[^.]+$/.exec(e.payload) : undefined;
        const temp_dir =`${dir}/${filename}`
        const dl_object = `${process.cwd()}/${temp_dir}/${filename}.${fileExtension || null}`
        
        if (!fs.existsSync(temp_dir)){
            fs.mkdirSync(temp_dir)
        }
        if(!fs.existsSync(dl_object)){
            verbosity.debug(`Starting http download to ${filename}`)
            const dl = new Downloader()
            await dl.singleFile(e.payload, dl_object)
            callback(dl_object)
        }else{
            verbosity.debug(`${filename} is previusly downloaded`)
            callback(dl_object)
        }

    },
    childProcess: (e) => {
        return new Promise(resolve => {
            require('child_process').exec(e, (err, stdout) => {
                verbosity.debug('new child_process to => ', e)
                if(err){
                    verbosity.debug(err)
                    resolve(err)
                }
                verbosity.debug(stdout)
                resolve(stdout)
            })
        })
    },
    executable: {
        win32: async (object) => {
            await _methodsControllers.childProcess(object)
        },
        linux: async (object) => {
            await _methodsControllers.childProcess(object)
        }
    }
}

function osExecMethod(e, id) {
    return new Promise(resolve => {
        if(e[process.platform]){
            verbosity.debug('Mathed exec script for ',  process.platform)
            switch (e[process.platform].type) {
                case "httpDownload":{
                    _methodsControllers.httpDownload({ filekey: id, extension: matchExecutableExtension(process.platform), payload: e[process.platform].httpDownload }, async (res) => {
                        verbosity.debug('Callback recived! Executing ', res)
                        await _methodsControllers.childProcess(res)
                        return resolve(true)
                    })
                    break
                }
                case "apt":{
                    // _methodsControllers.childProcess()
                    resolve(false)
                    break
                }
                // no case for pip (python is multiplataform)
                default: {
                    verbosity.debug('No exec method matched !')
                    resolve(false)
                    break
                }
            } 
        }else{
            verbosity.debug('No O.S compatible matched!')
            return resolve(false)
        }
    })
}


export async function _depInstall(dep, callback) {
    if (!dep || !dep.id) {
        verbosity.error('Invalid payload! ', dep)
        return false
    }
    switch (dep.method) {
        case "osExec":{
            if(dep.osExec){
                const exec = osExecMethod(dep.osExec, dep.id)
                await exec
                callback(true)
                break
            }else{
                callback(false)
                break
            }
        }
        case "apt":{
            await _methodsControllers.childProcess(`apt install ${dep.id}`)
            callback(true)
            break
        }
        case "pip":{
            await _methodsControllers.childProcess(`pip install ${dep.id}`)
            callback(true)
            break
        }
        default:{
            break
        }
    }
}

export function _depInstallDone(){
    frs.setItem('src', true)
    ReactDOM.unmountComponentAtNode(document.getElementById('app_modals'))
}

export function _depInstallFalse() {
    frs.setItem('src', false)
}

export const app = {
    init: () => {
        verbosity.debug("App runtime => ",frs.getItem('src'))
        if(frs.getItem('src') == 'false'){
            _initInstallDeps()
        }
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

app.init()
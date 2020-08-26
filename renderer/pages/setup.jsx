import React from 'react'
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import 'antd/dist/antd.css';
import './setup.css'

export default class SetupComponent extends React.PureComponent{
    state ={
        type: 'downloading',
        turn: 1,
        last: null,
        title: null,
        percent: 10,
        error: false,
    }

    end_Setup(){
        let LocalStorage = require('node-localstorage').LocalStorage;
        let frs = new LocalStorage("./scratch");
        frs.setItem('src', 'valid')
    }

    trylast(){
        this.setState({ turn: this.state.last, error: false })
    }

    next(){
        try {
            const updatedValue = [...this.state.deps].map(ita =>
              ita.t === this.state.turn? Object.assign(ita, { installed: !ita.installed }) : ita
            )
            this.setState({ turn: (this.state.turn++), percent: (this.state.percent + 10), deps: updatedValue })
        } catch (err) {
            console.log(err)
        }
        localStorage.setItem('deps', JSON.stringify(this.state.deps))
      
    }

    prev(){
        this.setState({ turn: (this.state.turn--), percent: (this.state.percent - 10) })
    }

    render(){
        return(
            <div className="setup_wrapper">
                <Icons.CloudDownloadOutlined id="head_cloud" />
                <h1>Installing all dependencies</h1>
                <antd.Card className="setup_proccess">
                    <div className="proccess_info">
                        <Icons.LoadingOutlined /> {this.state.type} {this.state.title}
                    </div>
                    <div>
                        <antd.Progress percent={this.state.percent} />
                        {this.state.error? <><antd.Button onClick={() => {this.trylast()}}> Try again </antd.Button><antd.Button onClick={()=> this.next()} > Next </antd.Button> </> : null}
                    </div>
                </antd.Card>
                
            </div>
        )
    }
}
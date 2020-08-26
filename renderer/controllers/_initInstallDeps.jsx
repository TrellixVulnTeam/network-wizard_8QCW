import React from 'react'
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import * as core from '../../core/index.js'
import 'antd/dist/antd.css';
import './_initInstallDeps.css'

export class SetupController extends React.PureComponent{
    state = {
        done: false,
        start: false,
        unlockModal: false,
        visibleModal: true,

        type: "",
        title: "",
        error: false,
        percent: 0,
        currentStep: 0
    }
    
    handleStep(){
        const dep = this.props.deps[this.state.currentStep]
        if (this.state.currentStep < (this.props.deps.length - 1)) {
            console.log('Settin up => ', dep.id)
            this.setState({ type: "Installing", title: dep.id })
            core._depInstall(dep, callback => {
                if (callback) {
                        this.state.currentStep++
                        this.handleStatus()
                        this.setState({ error: false })
                }else{
                    this.setState({ error: true })
                }
            })
            }else{
                this.handleDone()
            }
        }

    handleStatus(){
        const dep = this.props.deps[this.state.currentStep]
        this.setState({ title: dep.id, type: "Preparing" })
        this.handleStep()
    }

    handleDone(){
        this.setState({ title: "Finish", type: "", done: true })
        console.log('All done!')
        setTimeout(() => {
            this.setState({ visibleModal: false })
            core._depInstallDone()
        }, 1000);        
    }

    renderList(array){ 
        return array.map(e => {
          return <antd.Steps.Step key={e.id} title={e.id} description={`Method [${e.method}] `} />
        })
    }

    renderModal(){
        return(
            <div className="setup_wrapper">
            <Icons.CloudDownloadOutlined id="head_cloud" />
            <div style={{ width: "90%", margin: "auto", padding: "12px" }}>
                <antd.Steps current={this.state.currentStep}>
                    {this.renderList(this.props.deps)}
                </antd.Steps>
            </div>
            <antd.Card className="setup_proccess">
                <div className="proccess_info">
                    {this.state.error? <><Icons.WarningFilled /> Error !</> : <Icons.LoadingOutlined />} <span style={{ fontSize: '16px', marginLeft: '20px' }}>{this.state.type} {this.state.title}</span>
                </div>
                <div>
                    <antd.Progress strokeWidth="15px" percent={this.state.percent} />
                    {this.state.error? <><antd.Button onClick={() => null}> Try again </antd.Button><antd.Button > Next </antd.Button> </> : null}
                </div>
            </antd.Card>
        </div>
        )
    }

    componentDidMount(){
        antd.notification.info({ 
            message: 'Starting downloading runtime dependencies',
            description: 'For the application to work it is necessary to install a runtime',
            duration: '5000',
            placement: 'bottomLeft'
        })
    }
    componentWillUnmount(){
        if (!this.state.done) {
            antd.notification.warning({ 
                message: 'Runtime setup aborted',
                placement: 'bottomLeft'
            })
        }
    }


    render(){
        return(
        <antd.Modal
            title={<div><Icons.InfoCircleFilled style={{ color: "#69c0ff"}} /> Downloading runtime</div>}
            closable={this.state.unlockModal}
            visible={this.state.visibleModal}
            width="90%"
            okText="Download"
            cancelText="Dimmiss (Incomplete RUNTIME !)"
            onOk={() => {this.handleStep(), this.setState({ start: true })}}
            onCancel={() => {this.handleDone()}}
            okButtonProps={{ disabled: this.state.start }}
            cancelButtonProps={{ disabled: this.state.start }}
          >
          {this.renderModal()}
          
          </antd.Modal>
        )
    }
}
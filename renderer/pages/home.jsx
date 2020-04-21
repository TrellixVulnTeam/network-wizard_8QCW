import React from 'react';
import {nugget} from './nugget.js'
import Router from 'next/router'

import {PythonShell} from 'python-shell';
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import * as core from '../../core'
import os from 'os-utils'
import { Layout,Result,Button,message } from 'antd';
const { Header,Content } = Layout;

import 'antd/dist/antd.css';
import styles from  './main.css'

let _$options = {
  mode: 'text',
  encoding: 'utf8',
  scriptPath: `${process.cwd()}/py_scripts/`,
};

const _$interfaces =  new PythonShell('interfaces.py', _$options)
// const _$wash_listen = new PythonShell('wash_listen.py', _$options)


export default class Home extends React.PureComponent{
  state = {
    select_visible: false,
    using: null,
    loading: true,
    interfaces: null,
    default: null
  }

  toggleSelectAP(){
    this.setState({ select_visible: !this.state.select_visible })
  }

  __get = {
    interfaces: (callback) => {
      _$interfaces.on('message', function (message) {
        if (!message) return false
        return callback(message)
      });
    },
    wire_ap: (callback) => {

    }
  }

  
  renderInterfaces(){
    const { Option } = antd.Select;
    if (this.state.loading) {
      return <h3>Gathering Interfaces...</h3>
    }
    try {
      const data = this.state.interfaces
      const handleChange = (value) => {
        console.log(`selected ${value}`);
        this.setState({ using: value })
      }
    
      const isdefault = (i) => {
        if(this.state.default == i){
          return " DEFAULT |"
        }
        return null
      }
      if (this.state.loading) {
        return <h2>Loading</h2>
      }
      return (
        <antd.Select style={{ width: 300 }} defaultValue={this.state.using} onChange={handleChange}>
             {data.map(item => (<Option key={item.interface}>{isdefault(item.interface)} {item.mac} | {item.ip} </Option>))}
        </antd.Select>
      )
    } catch (error) {
      console.log(error)
    }
  }
  componentDidMount(){
    try {
      this.__get.interfaces((data)=>{
        let db = [];
        const interfc = JSON.parse(data).interfaces
        const defaint = JSON.parse(data).default_interface

        interfc.forEach(element => {
          db.push(JSON.parse(element))
        });
  
        console.log(db, defaint)
        this.setState({ loading: false, interfaces: db, default: defaint, using: defaint })
      })
    } catch (error) {
      console.log(error)
    }
    
  }
  render(){ 
    return(
      <Content style={{ padding: 48, textAlign: 'center', alignContent: 'center' }}>
        <div className={styles.brand}>
         <img style={{ width: '200px' }} src={nugget} />
         <h1>SPACY NUGGET</h1>
        </div>
        <div>
          <Icons.WifiOutlined /> Select a interface <br/>
          {this.renderInterfaces()}<br/>
          <Icons.AimOutlined /> Select an AP<br/>
          <antd.Button onClick={()=> this.toggleSelectAP()}> Select </antd.Button>
        </div>
        <br/><br/>
        <Button onClick={()=> Router.push('/listen')}> Start Listen </Button>
        <Button onClick={()=> core.app.setup()}> Install Python3 </Button>
        <br/>
        {os.platform()}
        <antd.Drawer
          title="Select an AP"
          placement="right"
          closable={true}
          onClose={() => this.toggleSelectAP()}
          visible={this.state.select_visible}
        >
          <p>Some contents...</p>
          <p>Some contents...</p>
          <p>Some contents...</p>
        </antd.Drawer>
      </Content>
 
    )
  }
}


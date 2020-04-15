import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import Router from 'next/router'

import {nugget} from './nugget.js'
import {PythonShell} from 'python-shell';
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import * as core from '../../core'

var os 	= require('os-utils');


let options = {
  mode: 'text',
  encoding: 'utf8',
  scriptPath: `${process.cwd()}/py_scripts/`,
};

core.app.init()

const _$interfaces =  new PythonShell('interfaces.py', options)

const { Option } = antd.Select;


import {
  Layout,
  Result,
  Button,
  message,
} from 'antd';

import 'antd/dist/antd.css';
import styles from  './main.css'
const {
  Header,
  Content,
} = Layout;

export default class Main extends React.PureComponent{
  state = {
    select_visible: false,
    using: null,
    loading: true,
    interfaces: null,
    default: null
  }

  toogleSelectAP(){
    this.setState({ select_visible: !this.state.select_visible })
  }

  __get = {
    interfaces: (callback) => {
      _$interfaces.on('message', function (message) {
        if (!message) return false
        return callback(message)
      });
    }
  }

  
  renderInterfaces(){
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
          {this.renderInterfaces()}
        </div>
        <br/><br/>
        <Button onClick={()=> Router.push('/listen')}> Start Listen </Button>
        <Button onClick={()=> core.app.setup()}> Install Python3 </Button>
        <br/>
        {os.platform()}
        <antd.Drawer
          title="Select an AP"
          placement="right"
          closable={false}
          onClose={this.toggleSelectAP}
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


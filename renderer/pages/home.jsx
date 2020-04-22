import React from 'react';
import {nugget} from './nugget.js'
import Router from 'next/router'

import {PythonShell} from 'python-shell';
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import * as core from '../../core'
import os from 'os-utils'
import { Layout,Result,Button,message } from 'antd';

import Listen from './listen'

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
    nt_mac: null,
    nt_ch: null,
    nt_save: false,

    active_frag: null,
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

    },

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
             {data.map(item => (<Option key={item.interface}>{isdefault(item.interface)} {item.mac} </Option>))}
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


  profile = {
    new: () => {
      const { nt_mac, nt_ch, using, nt_save } = this.state
      if(nt_mac && nt_ch){
      const n = new Date
      const a = { mac: nt_mac, channel: nt_ch, interface: using, key: n.getTime() }
      if(nt_save){
        try {
          const s_profiles = JSON.parse(localStorage.getItem('profiles'))
          let ct = []
        
          if(s_profiles){
            ct = s_profiles
          }
          
          const nw = ct.concat(a)
          localStorage.setItem('profiles', JSON.stringify(nw))
        } catch (error) {
          console.log(error)
        }
      }
      localStorage.setItem('active_profile', JSON.stringify(a))
      this.setState({ active_frag: <Listen profile={a} /> })
      return true
      }
      return false
    },
    resume: () => {
      try {
        const ac_profile = JSON.parse(localStorage.getItem('active_profile'));
        const a = { mac: ac_profile.mac, channel: ac_profile.channel, interface: ac_profile.interface }
        this.setState({ active_frag: <Listen profile={a} /> })
      } catch (error) {
        console.log(error)
      }
    },
    end: () => {
      this.setState({ active_frag: null })
      localStorage.removeItem('active_profile')
    }

  }

  startListen(){
    const ac_profile = localStorage.getItem('active_profile');
    const p_new = () => this.profile.new()
    const p_res = () => this.profile.resume()
    if(ac_profile){
      return antd.Modal.confirm({
        title: 'Profile Detected',
        content: (
          <div>
            <p>It seems that there is still an active profile.</p>
            <p>Do you want to resume it or create a new one?</p>
            <p> {ac_profile} </p>
          </div>
        ),
        okText: "New",
        cancelText: "Resume",
        onOk() {
          p_new()
        },
        onCancel(){
          p_res()
        },
      });
    }
    return this.profile.new()
  }

  render(){ 
    const nt_mac_ha = (e) =>{
      this.setState({ nt_mac: e.target.value })
    }
    const nt_ch_ha = (e) =>{
      this.setState({ nt_ch: e })
    }
    const nt_save_ha = (e) =>{
      console.log(e.target.checked)
      this.setState({ nt_save: e.target.checked })
    }

    if (this.state.active_frag){
      return <>
        <antd.Button onClick={() => this.profile.end() } > Exit </antd.Button>
        <React.Fragment>{this.state.active_frag}</React.Fragment>
      </>
    }

    return(
      <Content style={{ padding: 48, textAlign: 'center', alignContent: 'center' }}>
        <div className={styles.brand}>
         <img style={{ width: '200px' }} src={nugget} />
         <h1>SPACY NUGGET</h1>
        </div>
        <div>
          <Icons.WifiOutlined /> Select a interface <br/>
          {this.renderInterfaces()}<br/>
         
          <antd.Input.Group compact>
              <Icons.AimOutlined /> MAC <antd.Input  styles={{ width: 300 }} placeholder="XX:XX:XX:XX" onChange={nt_mac_ha} />
              Channel <antd.InputNumber min={1} max={10} defaultValue={this.state.nt_ch} onChange={nt_ch_ha} />
          </antd.Input.Group>
        </div>
        <br/>
        <Button onClick={()=> this.startListen()}> Start Listen </Button><br/><br/>
        <antd.Checkbox onChange={nt_save_ha}> Save Profile? </antd.Checkbox>
        <br/><br/>
        {os.platform()}
    
      </Content>
 
    )
  }
}


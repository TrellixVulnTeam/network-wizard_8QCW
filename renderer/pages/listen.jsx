import React from 'react'
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'

import Head from 'next/head'
import Link from 'next/link'
import {PythonShell} from 'python-shell';
import Router from 'next/router'

import * as core from '../../core'

import 'antd/dist/antd.css';

var os 	= require('os-utils');

export default class Listen extends React.PureComponent {
    state = {
        profile: this.props.profile,
        loading: true,
        clients: [{}],
        deauth: [{}],
        response: null
    }

    componentDidMount(){
        const { profile } = this.state
        this.setState({ clients: this.getClients(), loading: false })

        const payload = { mac: profile.mac, channel: profile.channel, _interface: profile.interface, }
        core._$.getClients((res)=>{
            console.log(res)
            this.setState({ response: res })
        },payload)
    }

    getClients(){
        return [{mac: '00:00:00:00', alias: 'Unknown', platform: 'Unknown', packages: 'xxx', lost: 'xxx', dbm: '-50'}, {mac: '01:01:01:01', alias: 'Unknown', platform: 'Unknown', packages: 'xxx', lost: 'xxx', dbm: '-60'}]
    }
    renderClientsDisconnected(){
        const data = this.state.deauth
        const List = antd.List
        return (
            <div>
                <antd.List
                 itemLayout="horizontal"
                 dataSource={data}
                 renderItem={item => (
                   <List.Item>
                     <List.Item.Meta
                       title={<div><Icons.QuestionCircleOutlined /> <a> {item.alias} | {item.mac} </a></div>}
                     />
                     {item.platform}  |  {item.packages}  |  {item.lost}  |  {item.dbm}
                   </List.Item>
                 )}
                />
            </div>
        )

    }
    renderClientsConnected(){
        console.log(this.state.clients)
        const data = this.state.clients
        const List = antd.List
            return (
                <div>
                    <antd.List
                     itemLayout="horizontal"
                     dataSource={data}
                     renderItem={item => (
                       <List.Item>
                         <List.Item.Meta
                           title={<div><Icons.QuestionCircleOutlined /> <a> {item.alias} | {item.mac} </a></div>}
                         />
                         {item.platform}  |  {item.packages}  |  {item.lost}  |  {item.dbm}
                       </List.Item>
                     )}
                    />
                </div>
            )
    }

    render(){
        if (!this.state.loading) {
            return(
                <div>
                    <h3><Icons.WifiOutlined /> Network <antd.Tag color="volcano">AD {this.state.profile.mac} | CH {this.state.profile.channel}  </antd.Tag> </h3>
                    <h3><Icons.GlobalOutlined /> Interface <antd.Tag > {this.state.profile.interface} </antd.Tag></h3>
                    <h2><Icons.ApartmentOutlined /> Connected</h2>
                    {this.renderClientsConnected()}
                    <h2><Icons.ApiOutlined /> Disconnected</h2>
                    {this.renderClientsDisconnected()}
                </div>
            )
        }
        return <div> Loading... </div>
    }
}
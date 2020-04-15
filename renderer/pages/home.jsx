import React from 'react'
import Router from 'next/router'
import Head from 'next/head'
import localforage from 'localforage'

import Main from './main.jsx'
import Listen from './listen.jsx'
import AP_list from './ap_list.jsx'
import Setup from './setup.jsx'

import { Layout } from 'antd';
import 'antd/dist/antd.css';
import styles from  './main.css'

const { Header, Content } = Layout;


export default class Home extends React.PureComponent{
    constructor(props){
      super(props),
      this.state={
        tab: 0
      }
    }
  
    nav = {
     go: (key)=>{
       if (!key) return false
       switch (key) {
          case 'listen':{
            return this.stage.listen()
          }
          case 'main':{
            return this.stage.main()
          }
          case 'ap_list':{
            return this.stage.AP_list()
          }
          default:{
             return false
          }
       }
      }
    }

    stage = {
      listen: () => {
        this.setState({ tab: 1 })
      },
      main: () => {
        this.setState({ tab: 0 })
      },
      ap_list: () => {
        this.setStage({ tab: 3 })
      },
    }

    renderStage(){
      switch (this.state.tab) {
        case 0:{
          return <Main router={this.nav}  />
        }
        case 1:{
          return <Listen router={this.nav} />
        }
        default:
          return <div>Render error</div>
      }
    }

    render(){
       return(
           <React.Fragment>
                <Head>
                    <title>Network Wizard</title>
                </Head>
        
                <Header style={{ color: '#fff!important', backgroundColor: '#2D2D2D' }}>
                  <h3 onClick={() => this.stage.main()} style={{ color: '#fff' }}>Network Wizard</h3>
                </Header>

                <Content>
                  {this.renderStage()}
                </Content>
           </React.Fragment>
       )
     }
    
      
     
 
    
}
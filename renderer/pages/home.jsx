import React from 'react';
import {nugget} from './nugget.js'
import Router from 'next/router'

import {PythonShell} from 'python-shell';
import * as antd from 'antd'
import * as Icons from '@ant-design/icons'
import * as core from '../../core'
import os from 'os-utils'
import { Layout, Button } from 'antd';

import 'antd/dist/antd.css';
import styles from  './main.css'

// let _$options = {
//   mode: 'text',
//   encoding: 'utf8',
//   scriptPath: `${process.cwd()}/py_scripts/`,
// };

// const _$healt = new PythonShell('healt.py', _$options)

export default class Home extends React.PureComponent{
  state = {
    renderFragment: null,
    loading: true,
  
  }


  componentDidMount(){
    
  }



  render(){ 
    if (this.state.renderFragment){
      return <>
        <antd.Button onClick={() => this.setState({renderFragment: null}) } > Exit </antd.Button>
        <React.Fragment>{this.state.renderFragment}</React.Fragment>
      </>
    }

    return(
      <Layout.Content style={{ padding: 48, textAlign: 'center', alignContent: 'center' }}>
        <div className={styles.brand}>
         <img style={{ width: '200px' }} src={nugget} />
         <h1>SPACY NUGGET</h1>
        </div>
        <div>
          
        </div>
        <br/>
        <Button onClick={() => null}> Request </Button>
        <Button onClick={() => {
          core._depInstallFalse() 
          location.reload() 
        }}> _depInstallFalse() </Button>
        <Button onClick={() => core._initInstallDeps() }> enforce setup </Button>
        <br/><br/>
        Running {os.platform()} 
    
      </Layout.Content>
 
    )
  }
}


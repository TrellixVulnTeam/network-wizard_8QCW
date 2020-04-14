import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import {nugget} from './nugget.js'
import {PythonShell} from 'python-shell';


let options = {
  mode: 'text',
  pythonOptions: ['-u'], // get print results in real-time
  scriptPath: `${process.cwd()}/py_scripts/`,
  args: ['value1', 'value2', 'value3']
};
 
PythonShell.run('init.py', options, function (err, results) {
  if (err) console.log(err);
  // results is an array consisting of messages collected during execution
  console.log('results: %j', results);
});


var os 	= require('os-utils');

import {
  Layout,
  Result,
  Button,
} from 'antd';

import 'antd/dist/antd.css';
import styles from  './main.css'
const {
  Header,
  Content,
} = Layout;

export default class Home extends React.PureComponent{
  render(){
    return(
    <React.Fragment>
      <Head>
        <title>Network Wizard</title>
      </Head>
  
      <Header style={{ color: '#fff!important', backgroundColor: '#2D2D2D' }}>
        <h3 style={{ color: '#fff' }}>Network Wizard</h3>
      </Header>
      <Content style={{ padding: 48, textAlign: 'center', alignContent: 'center' }}>
        <div className={styles.brand}>
         <img style={{ width: '200px' }} src={nugget} />
         <h1>SPACY NUGGET</h1>
        </div>
        <Button> Clients List </Button>
        <Button>  </Button>
        {os.platform()}
        
      </Content>
    </React.Fragment>
    )
  }
}


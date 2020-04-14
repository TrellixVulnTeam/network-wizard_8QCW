import React from 'react';
import Head from 'next/head'
import Link from 'next/link'
import {PythonShell} from 'python-shell';
PythonShell.run(`${__dirname}/py_scripts/init.py`, null, function (err) {
  if (err) throw err;
  console.log('finished');
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

const Next = () => {
  return (
    <React.Fragment>
      <Head>
        <title>Network Wizard</title>
      </Head>
  
      <Header>
        <Link href="/home">
          <a>Go to home page</a>
        </Link>
      </Header>
      <Content style={{ padding: 48, textAlign: 'center', alignContent: 'center' }}>
        <div className={styles.brand}>
         <img style={{ width: '200px' }} src="./images/nugget.gif" />
         <h1>SPACY NUGGET</h1>
        </div>
        <Button> Clients List </Button>
        <Button>  </Button>
        {os.platform()}
        
      </Content>
    </React.Fragment>
  );
};

export default Next;

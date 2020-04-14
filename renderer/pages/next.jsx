import React from 'react';
import Head from 'next/Head';
import Link from 'next/Link';
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
         <img style={{ width: '200px' }} src="https://media1.tenor.com/images/dd7aad2b40860796fa6840cc90103501/tenor.gif" />
         <h1>SPACY NUGGET</h1>
        </div>
        <Button> Clients List </Button>
        <Button>  </Button>
      </Content>
    </React.Fragment>
  );
};

export default Next;

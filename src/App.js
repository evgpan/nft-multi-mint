import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import MyWalletConfig from './MyWalletConfig';
import { ToastContainer } from 'react-toastify';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import HTypography from './components/HTypography';

import SelectJson from './components/SelectJson';
import Web3Provider from './context/Web3Provider';
import Deploy from './components/Deploy';
import Mint from './components/Mint';

import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <MyWalletConfig>
      <Web3Provider>
        <div className="App p-5">
          <div className='flex justify-end m-2'>
            <ConnectButton />
          </div>
          <div className='flex flex-col gap-6'>
            <div className='flex justify-center'>
              <HTypography variant='h4'>NFT MINTING</HTypography>
            </div>
            <SelectJson />
            <div className='flex justify-center'>
              <div className='flex flex-col w-1/2 gap-4'>
                <Deploy/>
                <Mint />
              </div>
            </div>
          </div>
        </div >
      </Web3Provider>
      <ToastContainer />
    </MyWalletConfig>
  );
}

export default App;

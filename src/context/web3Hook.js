import { config, ABI as Token1155 } from '../config';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { useEthersSigner } from './ethersAdapter';
import { parseEther, formatEther } from 'viem';

import { readContract, writeContract, waitForTransaction } from '@wagmi/core';

export const useSigningWeb3Client = () => {

  const [contractAddress, setContractAddress] = useState('');
  const [json, setJson] = useState('');
  const {address} = useAccount();
  const signer = useEthersSigner(config.CHAIN_ID);

  useEffect(() => {
    const contract = localStorage.getItem('contract');
    if (contract) {
      setContractAddress(contract);
    }
  }, []);

  const deploy = async (name, ipfsURI) => {
    try {
      
      const Token1155Factory = new ethers.ContractFactory(
        Token1155.abi,
        Token1155.bytecode,
        signer
      );

      const token1155Contract = await Token1155Factory.deploy(name, ipfsURI);
      await token1155Contract.waitForDeployment();
      const contract = await token1155Contract.getAddress();
      setContractAddress(contract);
      localStorage.setItem('contract', contract);
      console.log('Deployed at ', contract);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  const mint = async (addresses) => {
    try {
      const token1155Contract = new ethers.Contract(
        contractAddress,
        Token1155.abi,
        signer);
      const tx = await token1155Contract.mintDrop(addresses, 1);
      console.log("Tx ==> ", tx)
      const receipt = await tx.wait();
      console.log("Rec ===> ", receipt);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  return {
    json,
    contractAddress,
    
    deploy,
    mint,
    setJson,
    setContractAddress
  }
}

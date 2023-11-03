import React, { useCallback, useContext, useRef, useState } from "react";

import UploadIcon from '@mui/icons-material/Upload';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

import HButton from "./HButton";
import HTextField from "./HTextField";
import HTypography from "./HTypography";
import LoadingButton from '@mui/lab/LoadingButton';

import { Web3Context } from "../context/web3Context";
import { pinJSONToIPFS } from "../context/fileBaseSDK";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { parseErrorMsg } from "../utils";


const Deploy = () => {

  const [ updating, setUpdating ] = useState(false)
  const [ pending, setPending ] = useState(false)
  
  const uriRef = useRef(null);
  const name2Ref = useRef(null);

  const {json, contractAddress, deploy} = useContext(Web3Context);

  const { address } = useAccount();
  
  const onUploadClicked = async () => {
    console.log('>>>', 'onUploadClicked', json)
    if (json?.image && json?.attributes.length > 0) {
      try {
        setUpdating(true);
        const uriHash = await pinJSONToIPFS(json);
        console.log("UriHash =====> ", uriHash);
        uriRef.current.value = uriHash
        toast.success("Successfully uploaded JSON to Pinata.");
      } catch (err) {
        console.log(err)
      } finally {
        setUpdating(false);
      }
    }
  }

  const onDeployClicked = async () => {
    console.log('>>>', 'onDeployClicked')
    if ( !address ) {
      toast.warn('Connect your wallet')
      return;
    }
    if ( !name2Ref.current.value ) {
      toast.warn('Please input token name.');
      return;
    }

    if ( !uriRef.current.value ) {
      toast.warn('Please input the IPFS URI or upload the json.');
    }
    
    try {
      setPending(true);
      const ipfs = "ipfs://" + uriRef.current.value
      await deploy( name2Ref.current.value , ipfs)
      toast.success( 'Successfully deployed')
    } catch (err) {
      console.log(err)
      toast.error( parseErrorMsg(err?.message) )
    } finally {
      setPending(false);
    }
  }

  return <>
    <div className=''>
      <HTypography>IPFS URI</HTypography>
      <div className='flex gap-2 justify-between'>
        <HTextField
          className='w-2/3'
          inputRef={uriRef}
          placeholder="QmUJz..." />
        <LoadingButton
          className='w-[160px]'
          variant='contained'
          loading={updating}
          loadingPosition="start"
          startIcon={<UploadIcon />}
          onClick={onUploadClicked}>
          UPLOAD
        </LoadingButton>
      </div>
    </div>
    <div className=''>
      <HTypography>Name</HTypography>
      <div className='flex gap-2'>
        <HTextField
          className='w-2/3'
          inputRef={name2Ref}
          placeholder="JeEuTest" />
      </div>
    </div>
    <div className=''>
      <HTypography>Contract Address</HTypography>
      <div className='flex gap-2 justify-between'>
        <HTextField
          className='w-2/3'
          value={contractAddress}
          placeholder="0x..." />
        <LoadingButton
          className='w-[160px]'
          variant='contained'
          color="secondary"
          loadingPosition="start"
          loading={pending}
          startIcon={<UnarchiveIcon />}
          onClick={onDeployClicked}>
          Deploy
        </LoadingButton>
      </div>
    </div>
  </>
}

export default Deploy;
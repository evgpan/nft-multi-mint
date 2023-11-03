import React, { useCallback, useContext, useRef, useState } from "react";

import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import HTextField from "./HTextField";
import HButton from "./HButton";
import { styled } from "@mui/material";
import { isAddress } from "viem";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";
import { Web3Context } from "../context/web3Context";
import { parseErrorMsg } from "../utils";
import { LoadingButton } from "@mui/lab";

const InvisibleInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const SortableItem = (({ value }) => (
  <li className="cursor-pointer text-white py-1" tabIndex={0}>{value}</li>
))

const SortableList = (({ items }) => {
  return (
    <ul className='list-none'>
      {items.map((value, index) => (
        <SortableItem key={`item-${value}-${index}`} index={index} value={value} />
      ))}
    </ul>
  )
})

const Mint = () => {

  const [addrList, setAddrList] = useState([]);
  const [pending, setPending] = useState(false);
  
  const {address} = useAccount();
  const {mint} = useContext(Web3Context);

  const onSelectTxtClicked = async (ev) => {
    console.log('>>>', 'onSelectTxtClicked')
    if (ev.target.files.length === 0)
      return;
    const file = ev.target.files[0];
    if (file === null) return;

    const fileContent = await file.text();
    const items = fileContent.replace(/[\r]/gm, '').split('\n');
    const filtered = items.filter((el) => {
      return el !== null && el !== ' ' && isAddress(el)
    })
    setAddrList( filtered )
  }

  const onMintClicked = async () => {
    console.log('>>>', 'onMintClicked')
    if (!address) {
      toast.warn('Please connect wallet');
      return;
    }
    if (addrList?.length <= 0) {
      toast.warn('Please input addresses.');
      return;
    }
    if (addrList?.length > 600) {
      toast.warn('The count of the maximum address is 600.');
      return;
    }
    try {
      setPending(true);
      await mint(addrList);
      toast.success('Successfully transferred all addresses.');
    } catch (err) {
      console.log(err);
      toast.error(parseErrorMsg(err?.message));
    } finally {
      setPending(false);
    }
  }

  return <div className='flex gap-2 justify-between'>
    {/* <HTextField className='w-2/3' multiline rows={8} inputRef={txtRef} /> */}
    <div className="sort-list w-2/3 h-[500px] bg-transparent rounded-xl text-md px-3 py-2 border border-neutral-400 overflow-y-auto">
      {addrList?.length > 0 && (
        <SortableList items={addrList} />
      )}
    </div>
    <div className='flex flex-col gap-3'>
      <HButton
        className='w-[160px]'
        variant='contained'
        color="error"
        startIcon={<CloudDownloadIcon />}
        component="label">
        Select Txt
        <InvisibleInput
          accept='.txt'
          type="file"
          onChange={onSelectTxtClicked}>
        </InvisibleInput>
      </HButton>
      <LoadingButton
        className='w-[160px]'
        variant='contained'
        color="success"
        loadingPosition="start"
        loading={pending}
        startIcon={<LocalFireDepartmentIcon />}
        onClick={onMintClicked}>
        Mint
      </LoadingButton>
    </div>
  </div>
}

export default Mint;
import React, { useState, useRef, useCallback, useContext, useEffect } from "react";

import AddCircleIcon from '@mui/icons-material/AddCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import UploadIcon from '@mui/icons-material/Upload';

import { IconButton, InputAdornment } from '@mui/material';
import Fab from '@mui/material/Fab';
import { styled } from "@mui/material";

import HButton from "./HButton";
import HTextField from "./HTextField";
import HTypography from "./HTypography";
import { Web3Context } from "../context/web3Context";
import { pinFileToIPFS } from "../context/fileBaseSDK";

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

const SelectJson = () => {

  const [refresh, setRefresh] = useState(false);
  const [attrs, setAttrs] = useState([]);
  const [uploading, setUploading] = useState(false)
  const { setJson } = useContext(Web3Context)


  const imageRef = useRef(null)
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const jsonRef = useRef(null);
  // const jsonInputRef = useRef(null);
  // const imageInputRef = useRef(null);

  useEffect(() => {
    makeJSON();
  }, [])

  const handleAttrChange = (ev, idx, type) => {
    console.log('>>>', 'handleAttrChange')
    var arr = attrs;
    arr[idx][type] = ev.target.value;
    setAttrs(arr);
    setRefresh(!refresh)
    makeJSON()
  }

  const makeJSON = () => {
    const data = {
      image: imageRef.current.value,
      name: nameRef.current.value,
      description: descRef.current.value,
      attributes: attrs.map((attr, idx) => {
        return {
          trait_type: attr.trait_type,
          value: attr.value
        }
      })
    }
    setJson(data);
    const result = JSON.stringify(data, null, 2);
    jsonRef.current.value = result;
  }

  const onSelectJsonClicked = async (ev) => {
    console.log('>>>', 'onSelectJsonClicked')
    if (ev.target.files.length === 0)
      return;

    const file = ev.target.files[0];
    if (file === null) return;

    const fileContent = await file.text();
    const json = JSON.parse(fileContent);

    imageRef.current.value = json?.image || '';
    nameRef.current.value = json?.name || '';
    descRef.current.value = json?.description || '';    

    setAttrs( json?.attributes || []);

    const data = {
      image: imageRef.current.value,
      name: nameRef.current.value,
      description: descRef.current.value,
      attributes: json?.attributes.map((attr, idx) => {
        return {
          trait_type: attr.trait_type,
          value: attr.value
        }
      })
    }

    setJson(data);
    
    const result = JSON.stringify(data, null, 2);
    jsonRef.current.value = result;

    console.log(json);
  }

  const onImageUploadClicked = async (ev) => {
    console.log('>>> onImageUploadClicked');

    if (ev.target.files.length === 0)
      return;

    const file = ev.target.files[0];
    if (file === null) return;

    setUploading(true)
    let fileHash = await pinFileToIPFS(file);
    setUploading(false)
    
    fileHash = 'ipfs://'+ fileHash;
    imageRef.current.value = fileHash;
    console.log(fileHash)
  }

  const onDeleteClicked = (idx) => {
    console.log('>>> onDeleteClicked', idx);

    var arr = attrs;
    arr.splice(idx, 1);
    setAttrs(arr);
    setRefresh(!refresh)

    makeJSON();
  }

  const onAddMore = useCallback(() => {
    setRefresh(!refresh)

    var arr = attrs;
    arr.push({
      trait_type: 'attrCnt',
      value: 'attrCnt'
    })
    setAttrs(arr)
    makeJSON()
  }, [refresh])

  return <div className='flex justify-center items-center gap-6'>
    <div className='flex flex-col w-1/3 gap-2'>
      <HButton
        component="label"
        variant="contained"
        startIcon={<CloudDownloadIcon />}>
        Select JSON
        <InvisibleInput
          // ref={jsonInputRef}
          accept='.json, .txt'
          type="file"
          onChange={onSelectJsonClicked} />
      </HButton>
      <div className='flex justify-between items-center'>
        <HTypography>Image</HTypography>
        <HTextField
          placeholder="ipfs://"
          className='w-[350px]'
          inputRef={imageRef}
          onChange={makeJSON}
          defaultValue=''
          InputProps={{
            endAdornment: <InputAdornment position="end">
              <IconButton
                component="label">
                <UploadIcon color='primary' />
                <InvisibleInput
                  // ref={imageInputRef}
                  accept='.png,.jpeg,.jpg,.gif,.webp'
                  type="file"
                  onChange={onImageUploadClicked} />
              </IconButton>
            </InputAdornment>,
          }} />
      </div>
      <div className='flex justify-between items-center'>
        <HTypography>Name</HTypography>
        <HTextField
          placeholder="Nakamigos"
          className='w-[350px]'
          defaultValue=''
          inputRef={nameRef}
          onChange={makeJSON} />
      </div>
      <div className='flex justify-between items-center'>
        <HTypography>Description</HTypography>
        <HTextField
          placeholder="Description..."
          className='w-[350px]'
          inputRef={descRef}
          defaultValue=''
          onChange={makeJSON} />
      </div>

      <div className='flex justify-between items-center mt-2'>
        <HTypography>Attributes</HTypography>
      </div>

      <div className='flex flex-col gap-6'>
        {
          attrs.map((attr, idx) => {
            return <div key={idx} className='flex flex-col gap-2'>
              <div className='flex justify-between items-center'>
                <HTypography>Trait_Type</HTypography>
                <HTextField
                  placeholder="Hat/Helmet"
                  className='w-[350px]'
                  onChange={(ev) => handleAttrChange(ev, idx, 'trait_type')}
                  value={attr.trait_type}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">
                      <IconButton onClick={() => onDeleteClicked(idx)}>
                        <DeleteIcon color='primary' />
                      </IconButton>
                    </InputAdornment>,
                  }} />
              </div>
              <div className='flex justify-between items-center'>
                <HTypography>Value</HTypography>
                <HTextField
                  placeholder="Flat"
                  className='w-[350px]'
                  value={attr.value}
                  onChange={(ev) => handleAttrChange(ev, idx, 'value')}
                />
              </div>
            </div>
          })
        }
      </div>

      <div className='flex justify-center'>
        <HButton
          className=''
          variant="contained"
          onClick={onAddMore}
          startIcon={<AddCircleIcon />}>
          Add More
        </HButton>
      </div>
    </div>
    <div className='items-center'>
      <Fab color="primary" aria-label="add" size='small'>
        <DoubleArrowIcon />
      </Fab>
    </div>
    <div className='w-1/3'>
      <HTextField
        className='w-full'
        inputRef={jsonRef}
        multiline
        rows={15} />
    </div>
  </div>
}

export default SelectJson;
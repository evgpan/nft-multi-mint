import { TextField } from "@mui/material"

const HTextField = (props) => {
  return <TextField size="small" {...props}
    sx={{
      'input, textarea': {
        color: 'white'
      },
      fieldset: {
        borderColor: "gray",
        color: 'white'
      },
      "&:hover fieldset": {
        borderColor: "gray!important"
      },
      '& ::placeholder': {
        color: 'gray'
     }
    }}></TextField>
}

export default HTextField;
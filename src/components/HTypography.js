import { Typography } from "@mui/material"

const HTypography = (props) => {
  return <Typography className='text-white' {...props}>{props.children}</Typography>
}

export default HTypography;
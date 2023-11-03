import { Button } from '@mui/material';

const HButton = (props) => {
  return <Button {...props}>{props.children}</Button>
}

export default HButton;
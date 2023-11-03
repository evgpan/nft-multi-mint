import { Web3Context } from "./web3Context";
import { useSigningWeb3Client } from "./web3Hook"

const Web3Provider = ({children}) => {

  const contextValue = useSigningWeb3Client();

  return <Web3Context.Provider value = {contextValue}>
    {children}
  </Web3Context.Provider>
}

export default Web3Provider;
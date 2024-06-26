import { useAccount } from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { config } from "~/config";

const abi = [ 
    { 
        "inputs": [ 
          { 
            "internalType": "address", 
            "name": "spender", 
            "type": "address" 
          }, 
          { 
            "internalType": "uint256", 
            "name": "value", 
            "type": "uint256" 
          } 
        ], 
        "name": "approve", 
        "outputs": [ 
          { 
            "internalType": "bool", 
            "name": "", 
            "type": "bool" 
          } 
        ], 
        "stateMutability": "nonpayable", 
        "type": "function" 
      }
] as const


export function useApprove() {
    const account = useAccount()
    const { writeContracts } = useWriteContracts() 

 
    const handleApprove = () => {
        writeContracts({ 
        contracts: [ 
            { 
            address: config.TOKEN_ADDRESS, 
            abi, 
            functionName: "approve", 
            args: [config.MINT_ADDRESS,  10000 * 1000000000000000000],  
            }, 
        ], 
        }) 
    }

    return ({
        handleApprove
    })
}
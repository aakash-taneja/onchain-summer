import { useAccount, useWaitForTransactionReceipt } from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { useEffect, useMemo, useState} from "react";
import { config } from "~/config";

const abi = [
    { 
        "inputs": [ 
          { 
            "internalType": "string", 
            "name": "_adId", 
            "type": "string" 
          }, 
          { 
            "internalType": "string", 
            "name": "_contentUri", 
            "type": "string" 
          }, 
          { 
            "internalType": "uint256", 
            "name": "_adBalance", 
            "type": "uint256" 
          } 
        ], 
        "name": "createAd", 
        "outputs": [], 
        "stateMutability": "nonpayable", 
        "type": "function" 
      },
  ] as const

export function useMint() {
    const account = useAccount()
    const [hash, setHash] = useState<any>();

    const { writeContracts } = useWriteContracts({
        mutation: { onSuccess: (id: any) => {setHash(id)}},
      });

    const result = useWaitForTransactionReceipt({
        hash: hash,
        onSuccess(data: any) {
            console.log('Transaction success:', data)
          },
        onError(error: any) {
            console.error('Error:', error)
        },
    })

   

    const { data: availableCapabilities } = useCapabilities({
        account: account.address,
      });
      
    const capabilities = useMemo(() => {
    if (!availableCapabilities || !account.chainId) return {};
    const capabilitiesForChain = availableCapabilities[account.chainId];
    if (
        capabilitiesForChain["paymasterService"] &&
        capabilitiesForChain["paymasterService"].supported
    ) {
        return {
        paymasterService: {
            url: `${document.location.origin}/api/paymaster`,
        },
        };
    }
    return {};
    }, [availableCapabilities, account.chainId]);

    useEffect(() => {
        console.log('Hash is', hash)
    }, [hash])

    
    
    const handleMint = (adId: any, uri: any, amount: any) => {
        writeContracts({ 
            contracts: [ 
                { 
                address: config.MINT_ADDRESS, 
                abi, 
                functionName: "createAd", 
                args: [adId, uri, amount * 1000000000000000000], 
                }, 
            ], 
            })
    }
    

    return ({
        handleMint
    })
}
import { useAccount } from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { useMemo} from "react";
import { config } from "~/config";

const abi = [ 
    { 
     "inputs": [], 
     "name": "airdrop", 
     "outputs": [], 
     "stateMutability": "nonpayable", 
     "type": "function" 
    },         
] as const


export function useClaim() {
    const account = useAccount()
    const { writeContracts } = useWriteContracts() 

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
 
    const handleClaim = () => {
        writeContracts({ 
        contracts: [ 
            { 
            address: config.CLAIM_ADDRESS, 
            abi, 
            functionName: "airdrop", 
            args: [],  
            }, 
        ], 
        }) 
    }

    return ({
        handleClaim
    })
}
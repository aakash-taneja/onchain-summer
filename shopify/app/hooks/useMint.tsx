import { useAccount } from 'wagmi';
import { useWriteContracts, useCapabilities } from 'wagmi/experimental';
import { useMemo} from "react";

const abi = [
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [{ name: 'to', type: 'address' }],
      name: 'safeMint',
      outputs: [],
    }
  ] as const

export function useMint() {
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
 
    const handleMint = () => {
        writeContracts({ 
        contracts: [ 
            { 
            address: "0x119Ea671030FBf79AB93b436D2E20af6ea469a19", 
            abi, 
            functionName: "safeMint", 
            args: [account.address], 
            }, 
        ], 
        }) 
    }

    return ({
        handleMint
    })
}
import { useAccount } from 'wagmi';
import { getBalance } from '@wagmi/core';
import {config} from "../wagmi";

import { useEffect, useState } from "react";

export function useBalance() {
    const account = useAccount();
    const [balance, setBalance] = useState<any>();

    useEffect(() => {
        // Call the async function
        fetchBalance();
      }, []); // Empty dependency array ensures this effect runs only once after the initial render

      // Define an async function to handle the async operation
      const fetchBalance = async () => {
        try {
          const bal = await getBalance(config, {
            address: account?.address,
            token: '0x76160579627CD45Ba88f23E5919C61444AF53D5A',
          });
  
          console.log('Balance', bal);
  
          // Set the balance state with the resolved value
          setBalance(bal);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
    
    return ({balance, fetchBalance})
}
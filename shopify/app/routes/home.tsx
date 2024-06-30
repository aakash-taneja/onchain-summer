import { useAccount } from 'wagmi';

import { WalletCard } from "~/components/walletCard";
import AdsEmptyState from "~/components/adsEmpty";
import AdsCreate from "~/components/adsCreate";
import { useState } from 'react';


export function Home() {
    const account = useAccount()
    const [ads, setAds] = useState<any>();
    // const [create, setCreate] = useState(false);

    return (
        <>
            <WalletCard />
            {account?.address && 
            <>
              <div style={{marginTop: '20px'}}>
              <AdsCreate />
              </div>
              {/* <div style={{marginTop: '20px'}}>
              <AdsEmptyState />
              </div> */}
            </>
            }
        </>
    )
}

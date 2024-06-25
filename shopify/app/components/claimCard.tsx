import {
    Banner,
    Button,
    InlineStack,
    Text
  } from '@shopify/polaris';
  import React from 'react';

  import { useAccount } from 'wagmi';
import { useClaim } from '~/hooks/useClaim';
  
  export default function ClaimCard({fetchBalance}: any) {
    const account = useAccount();
    const hookClaim = useClaim();

    return (
      <>
      {account?.address && 
      <Banner title="Claim DGEN Tokens">
      <InlineStack direction="row" align="right" blockAlign="center">
        <Text>DGEN is the native token on Onchainads to publish and distrbute ads</Text>
        
        </InlineStack>
        <div style={{marginTop: '20px'}}>
        <Button onClick={hookClaim?.handleClaim}>
            Claim DGEN
        </Button>
        </div>
      </Banner>
    }
      </>
    );
  }
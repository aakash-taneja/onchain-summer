import { getBalance } from '@wagmi/core';
import { useAccount } from 'wagmi';

import {
    Text,
    Card,
    BlockStack,
    Link,
  } from "@shopify/polaris";

import BlueCreateWalletButton from "../components/walletButton";
import { SignIn } from "~/components/signIn";
import ClaimCard from "./claimCard";
import { useEffect, useState } from "react";

import {config} from "../wagmi";


export function WalletCard() {
    const [balance, setBalance] = useState<any>();
    const account = useAccount();

    useEffect(() => {
      // Define an async function to handle the async operation
      const fetchBalance = async () => {
        try {
          const bal = await getBalance(config, {
            address: account?.address,
            token: '0x22A4FA38D3E0a3E791FDb0b9C48Fd42FBCFeE84b',
          });
  
          console.log('Balance', bal);
  
          // Set the balance state with the resolved value
          setBalance(bal);
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
  
      // Call the async function
      fetchBalance();
    }, []); // Empty dependency array ensures this effect runs only once after the initial render
  

    return (
        <Card width="100%">
        <BlockStack gap="500">
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Welcome to Onchainads
            </Text>
            <Text variant="bodyMd" as="p">
              This embedded app template uses{" "}
              <Link
                url="https://shopify.dev/docs/apps/tools/app-bridge"
                target="_blank"
                removeUnderline
              >
                App Bridge
              </Link>{" "}
              interface examples like an{" "}
              <Link url="/app/additional" removeUnderline>
                additional page in the app nav
              </Link>
              , as well as an{" "}
              <Link
                url="https://shopify.dev/docs/api/admin-graphql"
                target="_blank"
                removeUnderline
              >
                Admin GraphQL
              </Link>{" "}
              mutation demo, to provide a starting point for app
              development.
            </Text>
          </BlockStack>
          <BlockStack gap="200">
            <Text as="h3" variant="headingMd">
              Get started with account
            </Text>
            <Text as="p" variant="bodyMd">
              Generate a product with GraphQL and get the JSON output for
              that product. Learn more about the{" "}
              <Link
                url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                target="_blank"
                removeUnderline
              >
                productCreate
              </Link>{" "}
              mutation in our API references.
            </Text>
          </BlockStack>
          <BlueCreateWalletButton/>
          {account?.address && 
          <>
            Balance is {balance?.symbol} {balance?.formatted}
          </>}
          {/* <SignIn /> */}
          <ClaimCard />
        </BlockStack>
      </Card>
    )
}
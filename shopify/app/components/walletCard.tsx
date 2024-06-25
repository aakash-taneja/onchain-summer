
import { useAccount } from 'wagmi';

import {
    Text,
    Card,
    BlockStack,
    Link,
  } from "@shopify/polaris";

import BlueCreateWalletButton from "../components/walletButton";
import ClaimCard from "./claimCard";
import { useBalance } from '~/hooks/useBalance';
import { useEffect } from 'react';


export function WalletCard() {
    const hookBalance = useBalance();
    const account = useAccount();

    useEffect(() => {
      hookBalance?.fetchBalance()
    }, [account?.address])

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
            Balance is {hookBalance?.balance?.symbol} {hookBalance?.balance?.formatted}
          </>}
          {hookBalance?.balance?.formatted <200 && <ClaimCard />}
        </BlockStack>
      </Card>
    )
}
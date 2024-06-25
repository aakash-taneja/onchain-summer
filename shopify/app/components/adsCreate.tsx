import React from 'react';
import {Card, TextField, InlineStack, Button, Text, LegacyStack, BlockStack} from '@shopify/polaris';
import {ImageIcon} from '@shopify/polaris-icons';
import {useState, useCallback} from 'react';
import ProductCard from './productCard';
import {useMint} from '.././hooks/useMint';
import { uploadTextToLighthouse } from '~/utils/lightHouseStorage';

export default function AdsCreate() {
    const [value, setValue] = useState('1776 Barnes Street\nOrlando, FL 32801');
    const [product, setProduct] = useState();
    const [uri, setUri] = useState<any>();
    const [amount, setAmount] = useState('1');
    const hookMint = useMint();

    const handleAmount = useCallback(
        (value: string) => setAmount(value),
        [],
    );

        

    const handleChange = useCallback(
        (newValue: string) => setValue(newValue),
        [],
    );

  // [START select-products]
  async function selectProducts() {
    const products = await window.shopify.resourcePicker({
      type: "product",
      action: "select",
      multiple: true,
      // selectionIds: ['gid://shopify/Product/1']
    });

    if (products) {
      const { images, id, variants, title, handle } = products[0];

      setProduct({
        productId: id,
        productVariantId: variants[0].id,
        productPrice: variants[0].price,
        productTitle: title,
        productHandle: handle,
        productUrl: variants[0].url,
        productAlt: images[0]?.altText,
        productImage: images[0]?.originalSrc,
        totalProducts: products.length,
      });
    }
  }
  // [END select-products]

  const createURI = async () => {
    try {
      const data = {text: value, ...{product}};
      const uri = uploadTextToLighthouse(data);
      
      setUri(uri);
    } catch (error) {
      console.error('Error uploading to lighthouse', error);
    }
    
  }

  return (
    <Card>
        <Text as="h3" variant="headingMd">
            Cast Ads to Farcaster
        </Text>
        <div style={{marginTop: '10px'}}>
                <TextField
            label="Cast here"
            value={value}
            onChange={handleChange}
            multiline={4}
            autoComplete="off"
            />
        </div>
            
        {product && 
        <div style={{marginTop: '10px'}}>
        <ProductCard product={product} selectProducts={selectProducts} />
        </div>
        }

        {!product && <div style={{marginTop: '10px', width:"100%"}}>
            <BlockStack>
                <Button onClick={selectProducts} width="100%">
                Ad a Product
            </Button>
            </BlockStack>
        </div>}

        <div style={{marginTop: '10px'}}>
            <LegacyStack>
            <LegacyStack.Item fill>Add DGENs</LegacyStack.Item>
            <TextField
                label="Price"
                labelHidden
                value={amount}
                onChange={handleAmount}
                autoComplete="off"
                align="right"
                type="number"
            />
            </LegacyStack>
        </div>
       
        <div style={{marginTop: '30px'}}>
        <InlineStack direction="row" align="space-between" blockAlign="center">
            <Button icon={ImageIcon} accessibilityLabel="Add theme" />
            {!uri && 
              <Button variant="primary" onClick={hookMint?.handleMint}
              >
              Mint Ad Onchain
              </Button>
            }
            {uri && 
              <Button variant="primary" 
              disabled={!product?.productId || !amount} 
              url={`https://warpcast.com/~/compose?text=${value}&embeds[]=https://onchainads.vercel.app/api`}
              target="_blank">
              Cast on Farcaster
              </Button>
            }
        </InlineStack>
        </div>
    </Card>
  );
}
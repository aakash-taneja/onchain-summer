import React, { useEffect } from 'react';
import {useState, useCallback} from 'react';
import {Card, TextField, InlineStack, Button, Text, LegacyStack, BlockStack, InlineError} from '@shopify/polaris';
import {ImageIcon, EditIcon} from '@shopify/polaris-icons';
import { v4 as uuidv4 } from 'uuid';
import ProductCard from './productCard';
import {useMint} from '.././hooks/useMint';
import { displayImage, uploadFileToLightHouse, uploadTextToLighthouse } from '~/utils/lightHouseStorage';
import { CastCard } from './castCard';
import { MediaUpload } from './mediaUpload';

export default function AdsCreate() {
    const [editing, setEditing] = useState(true);
    const [adId, setAdId] = useState<any>();
    const [value, setValue] = useState<any>();
    const [media, setMedia] = useState<any>();
    const [product, setProduct] = useState();
    const [uri, setUri] = useState<any>();
    const [txn, setTxn] = useState<any>();
    const [error, setError] = useState<any>();
    const [amount, setAmount] = useState<any>();
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

  const uploadImage = async (file: any) => {
    setError(null);
    try {
      console.log('Image file is', file)
      const imgUri = await uploadFileToLightHouse(file);
      console.log('imageURI', imgUri);
      setMedia(displayImage(imgUri));
    } catch (error) {
      console.error('Error uploading image to lighthouse', error);
      setError('Error uploading image');
    }
  }

  const createURI = async () => {
    try {
      let _adId;
      if (!adId) {
        _adId = uuidv4()
        setAdId(_adId);
      } else {
        _adId = adId;
      }
      const data = JSON.stringify({adId: _adId, text: value, media: media, ...{product}});
      const uri = await uploadTextToLighthouse(data);

      console.log('URI, adId', uri, _adId);
      setUri(uri);
      hookMint?.handleMint(_adId, uri, amount);
      setEditing(false);
    } catch (error) {
      console.error('Error uploading to lighthouse', error);
    }
    
  }

  useEffect(() => {
    if (amount > 200) {
      setError('Wallet Balance low for this Ad topup');
    } else {
      setError(null);
    }
  }, [amount])

  return (
    <Card>
        <Text as="h3" variant="headingMd">
            Cast Ads to Farcaster
        </Text>
        

        
        {editing && <>
          <div style={{marginTop: '10px'}}>
                <TextField
            label="Cast here"
            value={value}
            onChange={handleChange}
            multiline={3}
            autoComplete="off"
            />
             </div>

        <div style={{marginTop: '10px'}}>
        <MediaUpload triggerUpload={uploadImage} />
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
            <LegacyStack.Item fill>Topup ad with DGs</LegacyStack.Item>
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

        <InlineError message={error} fieldID="myFieldID" />

        <div style={{marginTop: '30px'}}>
        <InlineStack direction="row-reverse" align="space-between" blockAlign="center">
            
              <Button variant="primary" onClick={createURI} disabled={!value || !amount || !product?.productId || error}
              >
              Mint Ad Onchain
              </Button>
           
        </InlineStack>
        </div>
        </>
         }

        {!editing && uri && <div style={{marginTop: '10px'}}>
          <CastCard cast={{text: value, media: media, ...product, uri: uri}}/>
          <div style={{marginTop: '30px'}}>
            <InlineStack direction="row" align="space-between" blockAlign="center">
                <Button icon={EditIcon} accessibilityLabel="Add theme" onClick={() => {setEditing(true)}} />
                <Button variant="primary" 
                disabled={!product?.productId || !amount} 
                url={`https://warpcast.com/~/compose?text=${value}&embeds[]=https://onchainads.vercel.app/api/${uri}`}
                target="_blank">
                Cast on Farcaster
                </Button>
            </InlineStack>
          </div>
        </div>}
    </Card>
  );
}
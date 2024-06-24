import {
    LegacyCard,
    ResourceList,
    ResourceItem,
    Avatar,
    Text,
    InlineStack
  } from '@shopify/polaris';
  import React from 'react';
  
  export default function ProductCard({product, selectProducts}: any) {
    return (
      <LegacyCard>
        <ResourceList
          resourceName={{singular: 'customer', plural: 'customers'}}
          items={[
            product
          ]}
          renderItem={(item) => {
  
            return (
              <ResourceItem
                id={item?.id}
                media={
                  <Avatar customer size="md" name={name} source={item?.productImage} />
                }
                accessibilityLabel={`View details for ${name}`}
                name={name}
                onClick={selectProducts}
              >
                <InlineStack direction="row" align="space-between" blockAlign="center">
                    <div>
                        <Text variant="bodyMd" fontWeight="bold" as="h3">
                    {item?.productTitle}
                    </Text>
                    
                    <Text variant="bodyMd" as="h5">
                    Handle: {item?.productHandle}
                    </Text>
                    </div>
                    <Text variant="bodyMd" as="h5">
                  Price: $ {item?.productPrice}
                </Text>
                </InlineStack>
                
                
              </ResourceItem>
            );
          }}
        />
      </LegacyCard>
    );
  }
import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import React from 'react';

export function CastCard({cast}: any) {
  return (
    <MediaCard
      title={cast?.text}
      primaryAction={{
        content: 'Check Product',
        onAction: () => {},
      }}
      popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
    >
      <VideoThumbnail
        videoLength={80}
        thumbnailUrl="https://burst.shopifycdn.com/photos/business-woman-smiling-in-office.jpg?width=1850"
        onClick={() => console.log('clicked')}
      />
    </MediaCard>
  );
}
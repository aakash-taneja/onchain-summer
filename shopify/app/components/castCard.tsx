import {MediaCard, VideoThumbnail} from '@shopify/polaris';
import React from 'react';

export function CastCard({cast}: any) {
  return (
    <MediaCard
      primaryAction={{
        content: `Price $${cast?.productPrice}`,
        onAction: () => {},
      }}
      description={cast?.text}
      popoverActions={[{content: 'Dismiss', onAction: () => {}}]}
    >
      <img
        alt=""
        width="100%"
        height="100%"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        src={cast?.media}
      />
    </MediaCard>
  );
}
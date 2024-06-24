import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnect, useDisconnect, useAccount } from 'wagmi';
import { config } from '.././wagmi';

import {
  Button,
  Text,
  InlineStack
} from "@shopify/polaris";
 
const GRADIENT_BORDER_WIDTH = 2;
 
const buttonStyles = {
  background: 'transparent',
  border: '1px solid transparent',
  boxSizing: 'border-box',
  cursor: 'pointer'
};
 
const contentWrapperStyle = {
  position: 'relative',
};
 
function Gradient({ children, style, isAnimationDisabled = false }) {
  const [isAnimating, setIsAnimating] = useState(false);
  const gradientStyle = useMemo(() => {
    const rotate = isAnimating ? '720deg' : '0deg';
    return {
      transform: `rotate(${rotate})`,
      transition: isAnimating
        ? 'transform 2s cubic-bezier(0.27, 0, 0.24, 0.99)'
        : 'none',
      ...style,
    };
  }, [isAnimating, style]);
 
  const handleMouseEnter = useCallback(() => {
    if (isAnimationDisabled || isAnimating) return;
    setIsAnimating(true);
  }, [isAnimationDisabled, isAnimating, setIsAnimating]);
 
  useEffect(() => {
    if (!isAnimating) return;
    const animationTimeout = setTimeout(() => {
      setIsAnimating(false);
    }, 2000);
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [isAnimating]);
 
  return (
    <div style={contentWrapperStyle} onMouseEnter={handleMouseEnter}>
      <div className="gradient-background" style={gradientStyle} />
      {children}
    </div>
  );
}
 
export default function BlueCreateWalletButton({ height = 66, width = 200 }) {
  const { connectors, connect, data } = useConnect();
  const { disconnect } = useDisconnect()
  const account = useAccount();
 
  const minButtonHeight = 28;
  const minButtonWidth = 200;
  const buttonHeight = Math.max(minButtonHeight, height);
  const buttonWidth = Math.max(minButtonWidth, width);
  const gradientDiameter = Math.max(buttonHeight, buttonWidth);
  const styles = useMemo(
    () => ({
      gradientContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: buttonHeight,
        height: buttonHeight,
        width: buttonWidth,
        boxSizing: 'border-box',
        overflow: 'hidden',
      },
      gradient: {
        background:
          'conic-gradient(from 180deg, #45E1E5 0deg, #0052FF 86.4deg, #B82EA4 165.6deg, #FF9533 255.6deg, #7FD057 320.4deg, #45E1E5 360deg)',
        position: 'absolute',
        top: -buttonHeight - GRADIENT_BORDER_WIDTH,
        left: -GRADIENT_BORDER_WIDTH,
        width: gradientDiameter,
        height: gradientDiameter,
      },
      disconnect: {
        background: 'rgb(51, 0, 4)',
        position: 'absolute',
        top: -buttonHeight - GRADIENT_BORDER_WIDTH,
        left: -GRADIENT_BORDER_WIDTH,
        width: gradientDiameter,
        height: gradientDiameter,
      },
      buttonBody: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxSizing: 'border-box',
        backgroundColor: '#000000',
        height: buttonHeight - GRADIENT_BORDER_WIDTH,
        width: buttonWidth - GRADIENT_BORDER_WIDTH,
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold',
        fontSize: 18,
        borderRadius: buttonHeight,
        position: 'relative',
        paddingRight: 10,
        color: 'white',
        pointer: 'cursor'
      },
    }),
    [buttonHeight, buttonWidth, gradientDiameter]
  );
 
  const createWallet = useCallback(() => {
    const coinbaseWalletConnector = connectors.find(
      (connector) => connector.id === 'coinbaseWalletSDK'
    );
    if (coinbaseWalletConnector) {
      connect({ connector: coinbaseWalletConnector });
    }
  }, [connectors, connect]);

  const disconnectWallet = () => {
    disconnect()
  }
 
  return (
    <>
      {!account?.address && 
      <Button style={buttonStyles} onClick={createWallet} variant="primary">
      Add Wallet with Coinbase
      </Button>
      }
      {account.address && 
        <div style={{width: '100%'}}>
          <InlineStack direction="row" align="space-between" blockAlign="center">
          <Text>{account.address}</Text>
          <Button style={buttonStyles} onClick={disconnectWallet}>
            Disconnect Wallet
          </Button>
          </InlineStack>
        </div>
      }
    </>
  );
}
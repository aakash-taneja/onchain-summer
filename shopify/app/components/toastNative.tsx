import {Toast, Frame, Page, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';

export function ToastNative() {
  const [msg, setMsg] = useState<any>();

  const toggle = useCallback((msg: any) => setMsg(msg), []);

  return (
    <Toast content="Message sent" onDismiss={setMsg(null)} />
  );
}
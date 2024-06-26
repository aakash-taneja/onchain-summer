import {DropZone, LegacyStack, Thumbnail, Text} from '@shopify/polaris';
import {NoteIcon} from '@shopify/polaris-icons';
import {useState, useCallback, useEffect} from 'react';

export function MediaUpload({triggerUpload}: any) {
  const [file, setFile] = useState<File>();

  useEffect(() => {
    if (file) {
        triggerUpload(file);
    }
  }, [file])

  const handleDropZoneDrop = useCallback(
    (_dropFiles: File[], acceptedFiles: File[], _rejectedFiles: File[]) =>
      setFile(acceptedFiles[0]),
    [],
  );

  const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

  const fileUpload = !file && <DropZone.FileUpload />;
  const uploadedFiles = file && (
    <div style={{padding: '0'}}>
      <LegacyStack vertical>
      <LegacyStack alignment="center">
            <img
        alt=""
        width="30%"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        src={
            validImageTypes.includes(file.type)
              ? window.URL.createObjectURL(file)
              : NoteIcon
          }
      />
          </LegacyStack>
      </LegacyStack>
    </div>
  );

  return (
    <DropZone onDrop={handleDropZoneDrop}>
      {uploadedFiles}
      {fileUpload}
    </DropZone>
  );
}
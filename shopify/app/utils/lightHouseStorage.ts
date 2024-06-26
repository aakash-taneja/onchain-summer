import lighthouse from "@lighthouse-web3/sdk";
import { config } from "~/config";


export const uploadFileToLightHouse = async (file: any) => {
  const output = await lighthouse.upload(
    file,
    config.LIGHTHOUSE_API_KEY,
    false,
    undefined
  );
  return output.data.Hash;
};

export const uploadTextToLighthouse = async (text: string) => {
  const response = await lighthouse.uploadBuffer(
    text,
    config.LIGHTHOUSE_API_KEY
  );
  return response.data.Hash;
};

export const displayImage = (cid: string) => {
  return `https://gateway.lighthouse.storage/ipfs/${cid}`;
};

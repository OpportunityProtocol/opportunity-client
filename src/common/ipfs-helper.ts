import { create } from "ipfs-http-client";
import fleek from "../fleek";
import axios from 'axios'
import { PINATA_JWT } from "../constant";

export async function getMetadata(metadataString: string) {
    let retVal: any = {};

    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${metadataString}`).next();

        const jsonString = Buffer.from(retVal.value).toString("utf8");
        const parsedString = jsonString.slice(
          jsonString.indexOf("{"),
          jsonString.lastIndexOf("}") + 1
        );
        
        const parsedData = JSON.parse(parsedString);
        return parsedData
      } else {
        retVal = await getJSONFromIPFSPinata(metadataString)  //await fleek.getService(metadataString);
        return JSON.parse(retVal)
      }

    } catch (error) {
        return {}
    }
  }

export async function pinJSONToIPFSPinata(data: string) {
  var config = {
    method: 'post',
    url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
    headers: { 
      'Content-Type': 'application/json', 
    'Authorization': `Bearer ${PINATA_JWT}`
    },
    data
  };
  
  const res = await axios(config);
  return res.data?.IpfsHash
}

export async function getJSONFromIPFSPinata(ipfsHash: string) {
  var config = {
    method: 'get',
    url: `https://api.pinata.cloud/data/pinList?hashContains=${ipfsHash}`,
    headers: { 
      'Content-Type': 'application/json', 
    'Authorization': `Bearer ${PINATA_JWT}`
    }
  }
  
  const res = await axios(config);
  return res.data.rows[0]?.metadata?.keyvalues
}

export function generatePinataData(name: string, data: object): string {
  return JSON.stringify({
    pinataOptions: {
      cidVersion: 1
    },
    pinataMetadata: {
      name,
      keyvalues: data
    },
    pinataContent: {}
  })
}
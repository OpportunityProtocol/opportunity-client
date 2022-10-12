import { create } from "ipfs-http-client";
import fleek from "../fleek";
import axios from 'axios'
import { PINATA_JWT } from "../constant";

export async function getMetadata(metadataString: string) {
    let retVal: any = {};

    try {
      if (!PINATA_JWT) {
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
        retVal = await fleek.getService(metadataString); //getJSONFromIPFSPinata(metadataString)  
        return retVal 
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

const parsedKeys = [
  'certifications',
  'tags',
  'skills'
]

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

  const data = res.data.rows[0]?.metadata?.keyvalues

  for (const key in data) {
    if (parsedKeys.includes(key)) {
      data[key] = data[key].split(',')
    }
  }

  return data
} 

var convertArrayToObject = function(array){
  var thisEleObj = new Object();
  if(typeof array == "object"){
      for(var i in array){
          var thisEle = convertArrayToObject(array[i]);
          thisEleObj[i] = thisEle;
      }
  }else {
      thisEleObj = array;
  }
  return thisEleObj;
};

function parseNested(str) {
  try {
      return JSON.parse(str, (_, val) => {
          if (typeof val === 'string')
              return parseNested(val)
          return val
      })
  } catch (exc) {
      return str
  }
}

export function generatePinataData(name: string, data: object): string {
  let tempData = data
  for (const item in tempData) {
    if (Array.isArray(tempData[item])) {
      tempData[item] = tempData[item].join(',') //convertArrayToObject[tempData[item]]
    }
  }


  
  const stringified = JSON.stringify({
    "pinataOptions": {
      "cidVersion": 1
    },
    "pinataMetadata": {
      "name": name,
      "keyvalues": parseNested(JSON.stringify(tempData))
    },
    "pinataContent": parseNested(JSON.stringify(tempData))
  })

  return stringified
}
import { create } from "ipfs-http-client";
import fleek from "../fleek";

export async function getMetadata(metadataString: string) {
    let retVal: any = {};

    try {
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        const ipfs = create({
          url: "/ip4/127.0.0.1/tcp/8080",
        });

        retVal = await ipfs.get(`/ipfs/${metadataString}`).next();
      } else {
        retVal = await fleek.getService(metadataString);
      }

      if (!retVal) {
        return ''
      } else {
        const jsonString = Buffer.from(retVal.value).toString("utf8");
        const parsedString = jsonString.slice(
          jsonString.indexOf("{"),
          jsonString.lastIndexOf("}") + 1
        );

        if (!parsedString) {
            return {}
        }
        
        const parsedData = JSON.parse(parsedString);
        return parsedData
      }
    } catch (error) {
        return ''
    }
  }
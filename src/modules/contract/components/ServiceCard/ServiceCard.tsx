import React, { useEffect, useState } from "react";
import cx from "clsx";
import {
  Card,
  Avatar,
  CardContent,
  CardMedia,
  Button,
  Box,
  CardActions,
  Divider,
  Stack,
  Typography,
  Chip,
} from "@mui/material";
import { useStyles } from "./ServiceCardStyle";
import DAIIcon from "../../../../node_modules/cryptocurrency-icons/svg/color/dai.svg";
import { NextRouter, useRouter } from "next/router";
import { useGradientAvatarStyles } from "@mui-treasury/styles/avatar/gradient";
import { ServiceStruct } from "../../../../typechain-types/NetworkManager";
import { useContractRead } from "wagmi";
import { NETWORK_MANAGER_ADDRESS } from "../../../../constant";
import { NetworkManagerInterface } from "../../../../abis";
import { Result } from "ethers/lib/utils";
import fleek from "../../../../fleek";
import { create } from "ipfs-http-client";

interface IServiceCardProps {
  id: string;
  data?: ServiceStruct;
}

const ServiceCard = ({ id, data }: IServiceCardProps) => {
  const cardStyles = useStyles();
  const router: NextRouter = useRouter();
  const [user, setUser] = useState([]);
  const [loadedData, setLoadedData] = useState<ServiceStruct>(data);
  const [serviceMetadata, setServiceMetadata] = useState<any>({});
  const [displayImg, setDisplayImg] = useState();
  const networkManager_getServiceData = useContractRead(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface,
    },
    "getServiceData",
    {
      enabled: false,
      watch: false,
      args: id,
      onSuccess: (data: Result) => {
        setLoadedData(data);
      },
      onError: (error) => {
        console.log("networkManager_getServiceData");
        console.log(error);
      },
    }
  );

  const getServiceMetadata = async (ptr) => {
    let retVal: any = {};

    if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
      const ipfs = create({
        url: "/ip4/127.0.0.1/tcp/8080",
      });

      retVal = await ipfs.get(`/ipfs/${ptr}`).next();
    } else {
      retVal = await fleek.getService(loadedData.metadataPtr);
    }

    if (!retVal) {
      throw new Error("Unable to retrieve service metadata data");
    } else {
      const jsonString = Buffer.from(retVal.value).toString("utf8");
      const parsedString = jsonString.slice(
        jsonString.indexOf("{"),
        jsonString.lastIndexOf("}") + 1
      );
      const parsedData = JSON.parse(parsedString);
      const updatedImg = Buffer.from(parsedData.serviceThumbnail.data);
      
      setDisplayImg(updatedImg);
      setServiceMetadata(parsedData);
    }
  };

  const handleOnNavigateToServicePage = () => {
    router.push({
      pathname: "/contract/view/service",
      query: {
        ...loadedData,
        id: Number(id),
        wad: [
          Number(loadedData.wad[0]),
          Number(loadedData.wad[1]),
          Number(loadedData.wad[2]),
        ],
      },
    });
  };

  useEffect(() => {
    getServiceMetadata(loadedData.metadataPtr);
  }, [id]);

  useEffect(() => {
    //if data doesnt exist get it from contract
    if (!data) {
      networkManager_getServiceData.refetch();
    }
  }, [id]);

  const renderUsers = async () => {
    const a = await fetch("https://randomuser.me/api/?results=1", {});
    const users = await a.json();
    setUser(users.results);
  };

  useEffect(() => {
    renderUsers();
  }, []);

  const styles: ClassNameMap<GradientAvatarClassKey> = useGradientAvatarStyles({
    size: 50,
    gap: 3,
    thickness: 3,
    gapColor: "#f4f7fa",
    color: "linear-gradient(to bottom right, #feac5e, #c779d0, #4bc0c8)",
  });

  return (
    <Card variant="outlined" className={cx(cardStyles.root)}>
      <CardMedia image={URL.createObjectURL(new Blob([displayImg]))} sx={{ height: 250, width: '100%' }} />
      <CardContent>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <div
              style={{
                margin: "5px 0px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
              className={styles.root}
            >
              <Avatar
                src={user[0]?.picture?.thumbnail}
                style={{ width: 30, height: 30 }}
              />
            </div>

            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Box>

        <Typography
          paragraph
          fontWeight="medium"
          fontSize={14}
          color="#616161"
          style={{
            paddingTop: "10px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          I will manage your social media account on any platform. I have over
          10 years of exp
        </Typography>

        <Typography variant="caption">
          Collected by 20 people in your network
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <Typography fontWeight="medium" fontSize={13} color="rgb(94, 94, 94)">
            Price:
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            <img
              src="/assets/images/dai.svg"
              style={{ width: 15, height: 20 }}
            />
            <Typography fontSize={13}>
              {Math.random().toPrecision(2)}{" "}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          fullWidth
          variant="outlined"
          onClick={handleOnNavigateToServicePage}
        >
          See service
        </Button>
      </CardActions>
    </Card>
  );
};

export default ServiceCard;

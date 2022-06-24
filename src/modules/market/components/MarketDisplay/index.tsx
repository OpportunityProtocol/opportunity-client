import { useState, FC, useEffect, memo } from "react";
import { useStyles } from "./MarketDisplayStyles";

import {
  Typography,
  CardContent,
  Grid,
} from "@mui/material";
import ClickableCard from "../../../../common/components/ClickableCard/ClickableCard";
import { NextRouter, useRouter } from "next/router";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { MarketDetailsStruct } from "../../../../typechain-types/ITokenFactory";
import { useContractRead } from "wagmi";
import { MARKET_DESCRIPTION_MAPPING, TOKEN_FACTORY_ADDRESS } from "../../../../constant";
import { TokenFactoryInterface } from "../../../../abis";
import { Result } from "ethers/lib/utils";
import ethers from 'ethers'
interface IMarketDisplayProps {
  isShowingStats?: boolean;
  showDescription?: boolean;
  showStats?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (marketData: object) => void;
  marketId: number;
}

const MarketDisplay: FC<IMarketDisplayProps> = ({
  isShowingStats=true,
  showDescription = true,
  showStats = true,
  selectable,
  selected = false,
  onSelect,
  marketId
}) => {
  const classes: ClassNameMap<"marketTitle" | "primaryContentContainer"> =
    useStyles();
  const router: NextRouter = useRouter();
  const [marketDetails, setMarketDetails] = useState<MarketDetailsStruct>({})
  const [marketInfo, setMarketInfo] = useState<any>([])
  const tokenFactory_getMarketDetails = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface
    },
    "getMarketDetailsByID",
    {
      args: [marketId],
      enabled: false,
      watch: false,
      onSuccess: (data: Result) => {
        setMarketDetails(data)
      },
      onError: error => {
        console.log(error)
        console.log("getMarketDetailsByID")
      }
    }
  )

  useEffect(() => {
    tokenFactory_getMarketDetails.refetch()
  }, [marketId])

  const handleOnSelect = (): void => {
    // internal

    // external
    onSelect();
  };


  return (
    <ClickableCard
      sx={{
        border: (theme) =>
          selected
            ? `2px solid ${theme.palette.primary.main}`
            : "1px solid #ddd",
      }}
      variant="outlined"
      onClick={selectable ? () => handleOnSelect() : () => router.push("/jobs")}
    >
      <CardContent className={classes.primaryContentContainer}>
        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item>
            <Typography
              sx={{
                height: 25,
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
            {marketDetails.name}
            </Typography>
          </Grid>

          <Grid item />
        </Grid>
        {showDescription && (
          <Typography
     
            style={{  
              fontSize: 13,  
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              'WebkitLineClamp': 3,
              'WebkitBoxOrient': 'vertical' 
            }}
            color="text.secondary"
          >

             {MARKET_DESCRIPTION_MAPPING[marketDetails.name]} 
          </Typography>
        )}

        {showStats && (
          <Typography
            color="#49A882"
            pt={2}
            variant="body2"
            sx={{ height: 25 }}
          >
            {Math.floor(Math.random() * 3200)} contracts and services available
          </Typography>
        )}
      </CardContent>
    </ClickableCard>
  );
};

export{ type IMarketDisplayProps }
export default memo(MarketDisplay);

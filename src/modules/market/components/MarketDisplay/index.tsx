import { useState, FC, useEffect, memo } from "react";
import { useStyles } from "./MarketDisplayStyles";

import {
  Typography,
  CardContent,
  Grid,
  Divider,
} from "@mui/material";
import ClickableCard from "../../../../common/components/ClickableCard/ClickableCard";
import { NextRouter, useRouter } from "next/router";
import { ClassNameMap } from "@material-ui/core/styles/withStyles";
import { MARKET_DESCRIPTION_MAPPING, TOKEN_FACTORY_ADDRESS } from "../../../../constant";
import { Box } from "@mui/system";
interface IMarketDisplayProps {
  isShowingStats?: boolean;
  showDescription?: boolean;
  showStats?: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (marketData: object) => void;
  marketDetails: any;
}

const MarketDisplay: FC<IMarketDisplayProps> = ({
  isShowingStats=true,
  showDescription = true,
  showStats = true,
  selectable,
  selected = false,
  onSelect,
  marketDetails
}) => {
  const classes: ClassNameMap<"marketTitle" | "primaryContentContainer"> =
    useStyles();
  const router: NextRouter = useRouter();

  const [marketInfo, setMarketInfo] = useState<any>([])

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
            : "1px solid #eee",
            borderRadius: 4
      }}
      variant="outlined"
      onClick={selectable ? () => handleOnSelect() : () => router.push("/jobs")}
    >
      <Box sx={{ width: '100%', height: 200 }}>
          <img style={{ width: '100%', height: '100%' }} src='/assets/images/carousel_two.jpeg' /> 
      </Box>
      <Divider />
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
            {marketDetails?.name}
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

             {MARKET_DESCRIPTION_MAPPING[marketDetails?.name]} 
          </Typography>
        )}

        {isShowingStats && (
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

import { useState, FC, useEffect, memo } from "react";
import { useStyles } from "./MarketDisplayStyles";

import { Typography, CardContent, Grid, Divider } from "@mui/material";
import ClickableCard from "../../../../common/components/ClickableCard/ClickableCard";
import { NextRouter, useRouter } from "next/router";

import {
  MARKET_DESCRIPTION_MAPPING,
  TOKEN_FACTORY_ADDRESS,
} from "../../../../constant";
import { Box } from "@mui/system";
interface IMarketDisplayProps {
  isShowingStats?: boolean;
  showDescription?: boolean;
  showStats?: boolean;
  selectable?: boolean;
  text?: boolean;
  small?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  marketDetails: any;
}

const MarketDisplay: FC<IMarketDisplayProps> = ({
  isShowingStats = true,
  showDescription = true,
  showStats = true,
  small = false,
  selectable,
  selected = false,
  text = false,
  onSelect,
  marketDetails,
}) => {
  const classes =
    useStyles();
  const router: NextRouter = useRouter();

  const [marketInfo, setMarketInfo] = useState<any>([]);

  const handleOnSelect = (): void => {
    // internal

    //external
    onSelect();
  };

  return text ? (
    <Box>
      <Typography
        fontSize={13}
        fontWeight="medium"
        color={(theme) => theme.palette.primary.main}
      >
        {marketDetails?.name
          ? marketDetails?.name
          : "Unable to load market name"}
      </Typography>
    </Box>
  ) : (
    <Grid item xs={12} md={6} lg={4}>
      <ClickableCard
        sx={{
          boxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          WebkitBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          MozBoxShadow: '10px 10px 5px 0px rgba(238,238,238,0.75)',
          border: (theme) =>
            selected
              ? `2px solid ${theme.palette.primary.main}`
              : "1px solid #eee",
        }}
        variant="outlined"
        onClick={selectable ? () => handleOnSelect() : () => router.push(`/view/market/${marketDetails?.id}`)}
      >
        <Box sx={{ width: "100%", height: 150 }}>
          <img
            style={{ width: "100%", height: "100%" }}
            src="/assets/images/carousel_two.jpeg"
          />
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
                  color: "black",
                  height: 25,
                  fontSize: small ? 12 : 16,
                  fontWeight: (theme) => theme.typography.fontWeightBold,
                }}
              >
                {marketDetails?.name
                  ? marketDetails?.name
                  : "Unable to load market name"}
              </Typography>
            </Grid>

            <Grid item />
          </Grid>
          {showDescription && (
            <Typography
              sx={{
                py: 1,
                fontSize: small ? 10 : 13,
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
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
    </Grid>
  );
};

export { type IMarketDisplayProps };
export default memo(MarketDisplay);

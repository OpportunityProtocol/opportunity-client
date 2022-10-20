import { useState, FC, useEffect, memo } from "react";
import { useStyles } from "./MarketDisplayStyles";

import { Typography, CardContent, Grid, Divider, alpha, Card, CardActions, CardActionArea, Button } from "@mui/material";
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

  const handleOnSelect = (): void => {
    //internal event

    //external event
    onSelect();
  };

  return (
      <Card
        sx={{
          boxShadow: 'rgba(0, 0, 0, 0.1) -4px 9px 25px -6px',
          cursor: 'pointer',
          border: (theme) =>
            selected
              ? `2px solid ${theme.palette.primary.main}`
              : `1px solid #eee`,
        }}
        onClick={selectable ? () => handleOnSelect() : () => router.push(`/view/market/${marketDetails?.id}`)}
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
            variant='body2'
              sx={{
                height: 75,
                py: 1,
              //  fontSize: small ? 10 : 13,
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

        </CardContent>
      </Card>
 
  );
};

export { type IMarketDisplayProps };
export default memo(MarketDisplay);

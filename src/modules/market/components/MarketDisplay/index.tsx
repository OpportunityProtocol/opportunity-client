import { useState, FC } from "react";
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

interface IMarketDisplayProps {
  market: MarketDetailsStruct,
  isShowingStats: boolean;
  showDescription: boolean;
  showStats: boolean;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (marketData: object) => void;
}

const MarketDisplay: FC<IMarketDisplayProps> = ({
  market,
  isShowingStats=true,
  showDescription = true,
  showStats = true,
  selectable,
  selected = false,
  onSelect,
}) => {
  const classes: ClassNameMap<"marketTitle" | "primaryContentContainer"> =
    useStyles();
  const router: NextRouter = useRouter();

  const handleOnSelect = (): void => {
    // internal

    // external
    onSelect(market);
  };

  if (!market.exists) return null

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
                height: 20,
                fontWeight: (theme) => theme.typography.fontWeightBold,
              }}
            >
              {market.name}
            </Typography>
          </Grid>

          <Grid item />
        </Grid>
        {showDescription && (
          <Typography
            py={1}
            style={{ height: 120, fontSize: 15 }}
            color="text.secondary"
          >
            Lizards are a widespread group of squamate reptiles, with over 6,000
            species, ranging across all continents except Antarctica
          </Typography>
        )}

        {showStats && (
          <Typography
            color="#49A882"
            pt={2}
            variant="body2"
            sx={{ height: 60 }}
          >
            {Math.floor(Math.random() * 3200)} contracts and services available
          </Typography>
        )}
      </CardContent>
    </ClickableCard>
  );
};

export{ IMarketDisplayProps }
export default MarketDisplay;

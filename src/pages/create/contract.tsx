import { useState } from "react";
import clsx from "clsx";

import {
  Box,
  Card,
  Checkbox,
  Paper,
  InputBase,
  Chip,
  FormControlLabel,
  Button,
  TextField,
  FormGroup,
  Container,
  Stack,
  Divider,
  Grid,
  Typography,
} from "@mui/material";

import BoltIcon from "@mui/icons-material/Bolt";
import DateRangeIcon from "@mui/icons-material/DateRange";
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { useStyles } from "../../modules/contract/ContractStyles";
import { alpha } from "@mui/material";
import Link from "next/link";
import ClickableCard from "../../common/components/ClickableCard/ClickableCard";
import { NextRouter, useRouter } from "next/router";
import { Add } from "@mui/icons-material";
import TextInput from "../../common/components/BootstrapInput/BootstrapInput";
import { NextPage } from "next";
import StepperComponent from "../../common/components/Stepper";
import SearchBarV2 from "../../common/components/SearchBarV2/SearchBarV2";
import MarketDisplay from "../../modules/market/components/MarketDisplay";

const steps = ["Complete the basic information"];

/**
 * 
 * @returns 
 * TODO:
 * * Limit title character count to ?
 * * Limit description character count to 1112
 */
const CreateContractPage: NextPage = (): JSX.Element => {
  const [createContractForm, setCreateContractForm] = useState({
    contractTitle: "",
    contractDescription: "",
    contractTags: "",
    marketId: 1,
    tags: [],
    contractThumbnail: "",
    thumbnail: '',
    offers: {
      beginner: {
        price: 0,
        values: new Array(6).fill(''),
      },
      business: {
        price: 0,
        values: new Array(6).fill(''),
      },
      enterprise: {
        price: 0,
        values: new Array(6).fill(''),
      }
    },
  })
  const [step, setStep] = useState<number>(0);
  const router: NextRouter = useRouter();
  const classes = useStyles();
  const [contractDuration, setContractDuration] = useState("Quick Job");

  const onCreateRelationship = (): void => {
    router.push("/jobs");
  };

  const handleOnChangeCreateContractForm = (e) => {}

  const onTagInputKeyPress = (e) => {
    if (e.code === "Space") {
      if (createServiceForm.tags.length >= 5) {
        alert('No more tags')
        return
      }

      if (String(e.target.value).trim() == '') {
        return
      }

      const tag = createServiceForm.serviceTags;
      const updatedTags = createServiceForm.tags;
      updatedTags.push(tag);
      setCreateServiceForm({
        ...createServiceForm,
        tags: updatedTags,
        serviceTags: "",
      });
    }
  };

  const handleOnDeleteTag = (idx) => {
    const updatedTags = createServiceForm.tags
    updatedTags.splice(idx, 1)

    setCreateServiceForm({
      ...createServiceForm,
      tags: updatedTags
    });
  }

  return (
    <Container
      maxWidth="lg"
      component={Stack}
      spacing={5}
      sx={{ border: '1px solid #ddd', bgcolor: "#fff !important", padding: "2% 4%", width: "100%" }}
    >
      <StepperComponent steps={steps} activeStep={step} />
      <Box>
        <Typography fontWeight="bold" fontSize={25}>
          Create a contract
        </Typography>
        <Typography color="text.secondary">
          Create a contract and instantly connect with thousands of freelancers.{" "}
          <Typography variant="button" color="primary">
            Learn more
          </Typography>
        </Typography>
      </Box>
      <Box>
        <Stack
        sx={{ display: 'flex', width: '100% !important'}}
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography
            width={600}
            fontWeight="700"
            fontSize={18}
            color="text.primary"
          >
            Select a market
          </Typography>

<SearchBarV2 />
        </Stack>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={2.8}>
            <MarketDisplay
              selected={true}
              selectable
              onSelect={() => {}}
              market="Writing and Translation"
              showDescription={false}
              showStats={false}
            />
          </Grid>

          <Grid item xs={2.8}>
            <MarketDisplay
              selectable
              onSelect={() => {}}
              market="Accounting and Finance"
              showDescription={false}
              showStats={false}
            />
          </Grid>

          <Grid item xs={2.8}>
            <MarketDisplay
              selectable
              onSelect={() => {}}
              market="Social Media"
              showDescription={false}
              showStats={false}
            />
          </Grid>

          <Grid item xs={2.8}>
            <MarketDisplay
              selectable
              onSelect={() => {}}
              market="Graphic Design"
              showDescription={false}
              showStats={false}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box py={1}>
        <Typography
            width={600}
            fontWeight="700"
            fontSize={18}
            color="text.primary"
          >
            Contract Duration
          </Typography>
          <Typography variant="body2" className={classes.sectionSubheader}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt ipsum ut maximus malesuada.
          </Typography>
        </Box>

        <Grid
          sx={{ width: "100%" }}
          container
          spacing={3}
          direction="row"
          alignItems="center"
        >
          <Grid item>
            <ClickableCard
              variant="outlined"
              sx={{
                border:
                  contractDuration === "Quick Job"
                    ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                    : "none",
              }}
              className={clsx(
                classes.marketTypeCard,
                contractDuration === "Quick Job" ? classes.selectedCard : null
              )}
            >
              <BoltIcon sx={{ color: "#FFEB3B" }} />
              <Box py={2} className={classes.columnCenter}>
                <Typography fontWeight='medium' color='text.primary'>Quick</Typography>
                <Typography variant="body2">
                  Time Range: 30min - 1 Hour
                </Typography>
              </Box>
            </ClickableCard>
          </Grid>

          <Grid item>
            <ClickableCard
              variant="outlined"
              className={clsx(
                classes.marketTypeCard,
                contractDuration === "Short Term" ? classes.selectedCard : null
              )}
            >
              <DateRangeIcon sx={{ color: "#2196F3" }} />
              <Box py={2} className={classes.columnCenter}>
                <Typography fontWeight='medium' color='text.primary'>Short</Typography>
                <Typography variant="body2">A few days - 1 Month</Typography>
              </Box>
            </ClickableCard>
          </Grid>

          <Grid item>
            <ClickableCard
              variant="outlined"
              className={clsx(
                classes.marketTypeCard,
                contractDuration === "Long Term" ? classes.selectedCard : null
              )}
            >
              <HourglassTopIcon sx={{ color: "#4CAF50" }} />
              <Box py={2} className={classes.columnCenter}>
                <Typography fontWeight='medium' color='text.primary'>Long</Typography>
                <Typography variant="body2">A Month or Longer</Typography>
              </Box>
            </ClickableCard>
          </Grid>
        </Grid>
      </Box>

      <Box>
        <Box>
        <Typography
            width={600}
            fontWeight="700"
            color="text.primary"
            fontSize={18}
          >
            Basic Information
          </Typography>
          <Typography fontSize={15} color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt ipsum ut maximus malesuada.
          </Typography>
        </Box>

        <TextField
            margin="normal"
            sx={{ width: 600 }}
            variant="outlined"
            label="Contract Title"
            aria-label="Pick a title for your contract"
            name="contractTitle"
            type="text"
            onChange={handleOnChangeCreateContractForm}
          />

<TextField
rows={6}
multiline
            margin="normal"
            sx={{ width: 600 }}
            variant="outlined"
            label="Contract Description"
            aria-label="Write a description"
            name="contractDescription"
            type="text"
            onChange={handleOnChangeCreateContractForm}
          />


        <Grid
          sx={{ py: 2 }}
          container
          direction="row"
          alignItems="flex-start"
          spacing={10}
        >
          <Grid item>
            <Typography fontWeight='medium' color='text.primary'>Budget</Typography>
            <Typography variant='body2' color='text.secondary' width={350}>
              Your budget will reflect to freelancers how much you are willing to spend
            </Typography>
          </Grid>

          <Grid item>
            <TextInput value={0} placeholder="$550.00" sx={{ width: 100 }} />
          </Grid>
        </Grid>

        <Grid
          sx={{ py: 2 }}
          container
          direction="row"
          alignItems="flex-start"
          spacing={10}
        >
          <Grid item>
            <Typography fontWeight='medium' color='text.primary'>
              Deadline
            </Typography>
            <Typography  variant='body2' color='text.secondary' width={350}>
              This will be the display for your contract
            </Typography>
          </Grid>

          <Grid item>
            <TextInput value={0} placeholder="No deadline" sx={{ width: 100 }} />
          </Grid>
        </Grid>
        <Box mt={3}>
          <Typography
            width={400}
            pb={1}
            variant="subtitle2"
            color="text.secondary"
          >
            Become more recognizable with tags (max 5). Begin typing and add a tab using the space button
          </Typography>
          <Paper
            component="form"
            sx={{
              p: "10px 4px",
              display: "flex",
              alignItems: "center",
              width: 600,
            }}
          >
            <InputBase
            placeholder='Try shorttermjob...'
              name="contractTags"
              aria-label="contractTags"
              type="text"
              value={createContractForm.contractTags}
              sx={{ ml: 1, flex: 1 }}
              onKeyPress={onTagInputKeyPress}
              onChange={handleOnChangeCreateContractForm}
              startAdornment={
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ margin: "0 0.2rem 0 0", display: "flex" }}
                >
                  {createContractForm.tags.map((tag, idx) => {
                    return (
                      <Chip key={tag} label={tag} size="small" onDelete={() => handleOnDeleteTag(idx)} />
                    );
                  })}
                </Stack>
              }
            />
          </Paper>
        </Box>
      </Box>

      <Box>
        <Box>
        <Typography fontWeight="700" fontSize={18} color="text.primary">
            Definition of Done
          </Typography>
          <Typography fontSize={15} color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt ipsum ut maximus malesuada.
          </Typography>
        </Box>

        <TextInput
          label="Definition of done"
          multiline
          rows={6}
          width={500}
          placeholder="To complete the job you must..."
        />
      </Box>

      <Box>
        <Box pb={1}>
        <Typography fontWeight="700" fontSize={18} color="text.primary">
            Optional
          </Typography>
          <Typography fontSize={15} color="text.secondary">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
            tincidunt ipsum ut maximus malesuada.
          </Typography>
        </Box>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Do you want to payout your contract in milestones?"
            componentsProps={{
              typography: {
                fontSize: 15,
              },
            }}
          />
        </FormGroup>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Only specific languages"
            componentsProps={{
              typography: {
                fontSize: 15,
              },
            }}
          />
        </FormGroup>
      </Box>

      <Stack justifyContent='flex-end' direction='row'>
      <Button
            sx={{ mx: 1, width: 120,  p: 1 }}
            variant="contained"
            onClick={onCreateRelationship}
          >
              Create
          </Button>
      </Stack>

    </Container>
  );
};


export default CreateContractPage;

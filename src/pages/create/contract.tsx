import { ChangeEvent, useEffect, useState } from "react";
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
import { DesktopDatePicker } from "@mui/lab";
import { create } from "ipfs-http-client";
import fleek from "../../fleek";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { NETWORK_MANAGER_ADDRESS, TOKEN_FACTORY_ADDRESS } from "../../constant";
import { NetworkManagerInterface, TokenFactoryInterface } from "../../abis";
import { BigNumber } from "ethers";
import { Result } from "ethers/lib/utils";
import { hexToDecimal } from "../../common/helper";
import { CHAIN_ID } from "../../constant/provider";

/**
 * 
 * @returns 
 * TODO:
 * * Limit title character count to ?
 * * Limit description character count to 1112
 */
const CreateContractPage: NextPage = (): JSX.Element => {
  const [createContractForm, setCreateContractForm] = useState({
    contract_title: "",
    contract_description: "",
    contract_tags: "",
    contract_market_id: -1,
    tags: [],
    contract_budget: 0,
    deadline: new Date('2014-08-18T21:11:54'),
    contract_definition_of_done: '',
    meta: {
      duration: 'quick',
      specific_langauges: [],
    }
  })
  const router: NextRouter = useRouter();
  const classes = useStyles();
  const accountData = useAccount()
  const [contractMetadataURI, setContractMetadataURI] = useState<string>("")
  const [numMarkets, setNumMarkets] = useState<any>([]);
  const [marketsLoading, setMarketsLoading] = useState<boolean>(false);

  const networkManager_getMarkets = useContractRead(
    {
      addressOrName: TOKEN_FACTORY_ADDRESS,
      contractInterface: TokenFactoryInterface,
    },
    "getNumMarkets",
    {
      enabled: false,
      watch: false,
      chainId: CHAIN_ID,
      onSuccess: (data: Result) => {
        const total = hexToDecimal(data._hex);
        let list = [];
        for (let i = 0; i < total; i++) {
          list.push(Number(i) + 1);
        }
        setNumMarkets(list);
        // setMarketsDetails(data)
        setMarketsLoading(false);
      },
      onError: (error) => {
        setMarketsLoading(false);
      },
    }
  );

  useEffect(() => {
    //if is first render
    networkManager_getMarkets.refetch();
  }, []);

  const handleOnChangeDeadline = (newValue: Date | null) => {
    setCreateContractForm({
      ...createContractForm,
      deadline: newValue
    })
  };

  const handleOnChangeCreateContractForm = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    switch(e.target.id) {
      case 'contractTag':
        setCreateContractForm({
          ...createContractForm,
          contract_tags: e.target.value
        })
        break;
      case 'contractTitle':
        setCreateContractForm({
          ...createContractForm,
          contract_title: e.target.value
        })
        break;
      case 'contractDescription':
        setCreateContractForm({
          ...createContractForm,
          contract_description: e.target.value
        })
        break;
      case 'contractBudget':
        setCreateContractForm({
          ...createContractForm,
          contract_budget: Number(e.target.value)
        })
        break;
      case 'contractDefinitionOfDone':
        setCreateContractForm({
          ...createContractForm,
          contract_definition_of_done: e.target.value
        })
        break;
      case 'contractLanguageCheckbox':
        setCreateContractForm({
          ...createContractForm,
          meta: {
            ...createContractForm.meta,
            specific_langauges: e.target?.checked
          }
        })
        break;
    }
  }

  const onTagInputKeyPress = (e) => {
    if (e.code === "Space") {
      if (createContractForm.tags.length >= 5) {
        alert('No more tags')
        return
      }

      if (String(e.target.value).trim() == '') {
        return
      }

      const tag = createContractForm.contract_tags.trim();
      const updatedTags = createContractForm.tags;
      updatedTags.push(tag);
      setCreateContractForm({
        ...createContractForm,
        tags: updatedTags,
        contract_tags: "",
      });
    }
  };

  const handleOnDeleteTag = (idx) => {
    const updatedTags = createContractForm.tags
    updatedTags.splice(idx, 1)

    setCreateContractForm({
      ...createContractForm,
      tags: updatedTags
    });
  }

  const networkManager_createContract = useContractWrite(
    {
      addressOrName: NETWORK_MANAGER_ADDRESS,
      contractInterface: NetworkManagerInterface
  },
  "createContract",
  {
    args: [createContractForm.contract_market_id, contractMetadataURI]
  }
  )

  const handleOnCreate = async () => {
    try {
      let retVal;
      if (process.env.NEXT_PUBLIC_CHAIN_ENV === "development") {
        //https://ipfs.infura.io:5001/api/v0
        const ipfs = create({
          url: "/ip4/0.0.0.0/tcp/5001",
        });


        retVal = await (await ipfs.add(JSON.stringify(createContractForm))).path
     
      } else {
        retVal = await fleek.uploadService(
          String(accountData.data.address) +
            ":" +
            createContractForm.contract_title,
          JSON.stringify(createContractForm)
        );
      }

      setContractMetadataURI(retVal);

      if (String(retVal)) {
        await networkManager_createContract.write({
          args: [createContractForm.contract_market_id, String(retVal)]
        })
      } else {
        throw new Error('Error retrieving ipfs metadata hash')
      }

      router.push("/view/");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Container
      maxWidth="lg"
      component={Stack}
      spacing={5}
      sx={{ border: '1px solid #eee', bgcolor: "#fff !important", padding: "2% 4%", width: "100%" }}
    >
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

<SearchBarV2 placeholder='Search...' />
        </Stack>

        <Grid
          container
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          
          {numMarkets && numMarkets.length > 0 ?
          numMarkets.slice(0, 6).map((marketId) => {
            return (
              <Grid item xs={2.9}>
                <MarketDisplay
                  marketId={marketId}
                  isShowingStats={false}
                  selected={marketId === createContractForm.contract_market_id}
                  selectable
                  onSelect={() => setCreateContractForm({
                    ...createContractForm,
                    contract_market_id: marketId
                  })}
                  showDescription={false}
                  showStats={false}
                />
              </Grid>
            );
          })
          :
          <Grid item xs={12}>
            <Typography color='error'>
              Error occurred while loading marketplaces. <Typography component='span' variant="button"> Try again</Typography>
            </Typography>
          </Grid>

        }
          
        </Grid>
      </Box>

      <Box sx={{ width: "100%" }}>
        <Box py={1}>
        <Typography
            width={600}
            fontWeight="700"
            fontSize={18}
            color="text.primary"
            id='contractDuration'
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
            onClick={ () => setCreateContractForm({
              ...createContractForm,
              meta: {
                ...createContractForm.meta,
                duration: 'quick'
              }
            })}
              variant="outlined"
              sx={{
                border:
                  createContractForm.meta.duration === "quick"
                    ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                    : "none",
              }}
              className={clsx(
                classes.marketTypeCard,
                createContractForm.meta.duration === "quick" ? classes.selectedCard : null
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
                        onClick={ () => setCreateContractForm({
                          ...createContractForm,
                          meta: {
                            ...createContractForm.meta,
                            duration: 'short'
                          }
                        })}
              variant="outlined"
              sx={{
                border:
                  createContractForm.meta.duration === "short"
                    ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                    : "none",
              }}
              className={clsx(
                classes.marketTypeCard,
                createContractForm.meta.duration === 'short' ? classes.selectedCard : null
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
                        onClick={ () => setCreateContractForm({
                          ...createContractForm,
                          meta: {
                            ...createContractForm.meta,
                            duration: 'long'
                          }
                        })}
              variant="outlined"
              sx={{
                border:
                  createContractForm.meta.duration === "long"
                    ? `4px solid ${alpha("rgb(98, 202, 161)", 0.6)}`
                    : "none",
              }}
              className={clsx(
                classes.marketTypeCard,
                createContractForm.meta.duration === "long" ? classes.selectedCard : null
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
            size='small'
            label="Title"
            id='contractTitle'
            placeholder='Need software developer to...'
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
            size='small'
            id='contractDescription'
            variant="outlined"
            label="Description"
            placeholder='"In a maximum of 2-4 weeks I am looking to complete a website based on..."'
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
            <TextField size='small'  value={createContractForm.contract_budget} placeholder="550.00" id='contractBudget' onChange={handleOnChangeCreateContractForm} sx={{ width: 100 }} InputProps={{
              startAdornment: <Typography>$</Typography>
            }} />
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
          <DesktopDatePicker
          label="Date desktop"
          inputFormat="MM/dd/yyyy"
          value={createContractForm.deadline}
          onChange={handleOnChangeDeadline}
          renderInput={(params) => <TextField {...params} />}
        />
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
              value={createContractForm.contract_tags}
              sx={{ ml: 1, flex: 1 }}
              onKeyPress={onTagInputKeyPress}
              id='contractTag'
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

        <TextField
          label="Definition of done"
          id='contractDefinitionOfDone'
          value={createContractForm.contract_definition_of_done}
          multiline
          size='small'
          margin='normal'
          rows={6}
          onChange={handleOnChangeCreateContractForm}
          sx={{ width: 600 }}
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
            control={<Checkbox id='contractLanguageCheckbox' onChange={handleOnChangeCreateContractForm} defaultChecked checked={createContractForm.meta.specific_langauges} />}
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
            onClick={handleOnCreate}
          >
              Create
          </Button>
      </Stack>

    </Container>
  );
};


export default CreateContractPage;

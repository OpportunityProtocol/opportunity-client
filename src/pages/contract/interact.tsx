import React, { useState } from 'react';

import {
  Box,
  Card,
  Divider,
  Container,
  ListItemText,
  Grid,
  ListItem,
  List,
  Pagination,
  Button,
  ListItemIcon,
  Typography,
  IconButton,
  InputBase,
  Paper,
  CardContent,
  CardHeader,
} from '@mui/material';

import { useStyles } from '../../modules/contract/ContractStyles';
import { Attachment, ContentCopy, Send } from '@mui/icons-material';
import JobDisplay from '../../modules/market/components/JobDisplay';
import BountySubmission from '../../modules/market/components/BountySubmission/BountySubmission';
import { FileUploader } from 'react-drag-drop-files';
const fileTypes = ['PDF', 'PNG', 'DOC'];

/**
 * For now this is the all out page for viewing contracts
 * All users who message anyone or submit a proposal will happen here.  The only way you won't be able to access is if the job i claimed.. because you won't be able to click job card anywat
 * @returns
 */
const Contract: React.FunctionComponent<any> = () => {
  const classes = useStyles();
  const [conversationSelected, setConversationSelected] = useState<boolean>(true);

  return (
    <Container
      maxWidth="lg"
      component={Grid}
      direction="row"
      spacing={2}
      alignItems="flex-start"
      container
      className={classes.boxContainer}
    >
      <Grid direction="column" container item xs={12}>
        <Grid mb={2} item flex={1}>
          <Box sx={{ border: '1px solid #eee' }}>
            <JobDisplay hasButton={false} />
          </Box>
        </Grid>
        <Grid item flex={3} sx={{}}>
          {/* Traditional Markets Display */}
          <Card variant="outlined" sx={{ my: 1, height: '100%', flexGrow: 1, flex: 1 }}>
            <Grid
              container
              direction="column"
              justifyContent="space-between"
              sx={{ height: '100%' }}
            >
              <Grid item xs={9} flexGrow={1} flex={1}>
                <CardContent sx={{ height: '100%' }}>
                  <div className={classes.chatArea}>
                    <Typography variant="caption" color="rgb(94, 94, 94)">
                      No messages have been sent between you and @happytowork
                    </Typography>
                  </div>
                </CardContent>
              </Grid>

              <Grid item xs={3} sx={{ borderTop: '1px solid #eee' }}>
                <CardContent className={classes.inputContainer}>
                  <IconButton>
                    <Attachment />
                  </IconButton>
                  <Paper variant="outlined" sx={{ flex: 1, p: 1 }}>
                    <InputBase placeholder="Send a message " className={classes.inputBase} />
                  </Paper>
                  <Button
                    endIcon={<Send sx={{ color: 'white' }} />}
                    color="secondary"
                    sx={{ bgcolor: '#fafafa', mx: 1, width: 100 }}
                    variant="contained"
                  >
                    Send
                  </Button>
                </CardContent>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Contract;

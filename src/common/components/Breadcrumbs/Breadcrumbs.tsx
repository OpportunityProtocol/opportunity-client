import React, { FunctionComponent } from 'react';
import { Breadcrumbs, Chip, Container, Stack, Button, Box, Theme } from '@mui/material';
import { styled, emphasize } from '@mui/system';
import { NextRouter, useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import { selectLens, selectVerificationStatus } from '../../../modules/user/userReduxSlice';

const StyledBreadcrumb = styled(Chip)(({ theme }: { theme?: Theme }) => {
  const backgroundColor = theme?.palette.grey[100];
  return {
    backgroundColor: 'transparent',
    height: theme?.spacing(3),
    color: theme?.palette.text.primary,
    fontWeight: theme?.typography.fontWeightMedium,
    '&:hover, &:focus': {
      backgroundColor: emphasize(String(backgroundColor), 0.06),
    },
    '&:active': {
      boxShadow: theme?.shadows[1],
    },
  };
}) as typeof Chip; // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591

const NavigationBreadcrumbs: FunctionComponent = () => {
  const router: NextRouter = useRouter();
  const isVerifiedFreelancer = useSelector(selectVerificationStatus)

  return (
    <Container maxWidth="lg" sx={{ padding: '1% 0%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        <StyledBreadcrumb component="a" href="#" label="Home" />
        <StyledBreadcrumb component="a" href="#" label="Catalog" />
        <StyledBreadcrumb label="Accessories" />
      </Breadcrumbs>

      <Stack direction='row' justifyContent='flex-end' spacing={2}>
      <Button  onClick={() => router.push('/create/contract')} size='small' variant='contained' sx={{width: 'auto', height: 25}}>
              Create Contract
            </Button>

            <Button onClick={() => router.push('/create/service')} size='small' variant='contained' sx={{width: 'auto', height: 25}} disabled={isVerifiedFreelancer === false}>
              Create Service
            </Button>
      </Stack>
    </Container>
  );
};

export default NavigationBreadcrumbs;

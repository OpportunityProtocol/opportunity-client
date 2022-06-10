import React, { FunctionComponent } from 'react';
import { Breadcrumbs, Chip, Container, Box, Theme } from '@mui/material';
import { styled, emphasize } from '@mui/system';

import HomeIcon from '@mui/icons-material/Home';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useRouter } from 'next/router';

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
  const router = useRouter();
  return (
    <Container maxWidth="lg" sx={{ padding: '1% 0%' }}>
      <Breadcrumbs aria-label="breadcrumb" separator="›">
        <StyledBreadcrumb component="a" href="#" label="Home" />
        <StyledBreadcrumb component="a" href="#" label="Catalog" />
        <StyledBreadcrumb label="Accessories" />
      </Breadcrumbs>
    </Container>
  );
};

export default NavigationBreadcrumbs;

import React from 'react';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  margin: theme.spacing(2),
  maxWidth: 600,
  width: '100%',
}));

const ValueTypography = styled(Typography)(({ theme }) => ({
  color: theme.palette.success.main,
  fontWeight: 'bold',
}));

const Publication = ({ publication }) => {
  return (
    <StyledCard>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h5" component="h2">
                {publication.name}
              </Typography>
              <ValueTypography variant="h6">
                ${publication.valueMoney}
              </ValueTypography>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Card:</strong> {publication.cardBase.Name}
            </Typography>
            <Typography variant="body1">
              <strong>Game:</strong> {publication.game.Name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              <strong>Owner:</strong> {publication.owner.ownerName}
            </Typography>
            <Typography variant="body1">
              <strong>Offers:</strong> {publication.offers.length}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="caption" color="textSecondary">
              Posted: {new Date(publication.createdAt).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </StyledCard>
  );
};

export default Publication;


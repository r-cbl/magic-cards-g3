import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Typography } from '@mui/material';
import Publication from './publication';

const ViewPublications = () => {
  const dispatch = useDispatch();

  const publications = useSelector(state => state.publications.publications);

  useEffect(() => {
    dispatch.publications.fetchAllPublications();
  }, [dispatch]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Publications
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(publications) && publications.map((publication) => (
          <Grid item xs={12} key={publication.id}>
            <Publication publication={publication} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ViewPublications;

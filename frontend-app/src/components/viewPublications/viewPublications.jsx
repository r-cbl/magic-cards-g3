import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  FormControl,
  OutlinedInput,
  InputAdornment,
} from '@mui/material';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import RssFeedRoundedIcon from '@mui/icons-material/RssFeedRounded'; // Assuming you might want an RSS feed or similar icon
import Publication from './publication';

// Simple Search component based on the template
function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search-publications"
        placeholder="Search publications..."
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search publications',
        }}
      />
    </FormControl>
  );
}

const ViewPublications = () => {
  const dispatch = useDispatch();
  const publications = useSelector(state => state.publications.publications);
  // const loading = useSelector(state => state.loading.models.publications.fetchAllPublications);

  useEffect(() => {
    dispatch.publications.fetchAllPublications();
  }, [dispatch]);

  const handleFilterClick = () => {
    console.info('Filter chip clicked.'); // Placeholder action
  };

  return (
    // Use Box for main container to allow easier flex layout if needed later
    <Box sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}> {/* Add some padding */}
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Publications
        </Typography>
        <Typography color="text.secondary">
          Browse the latest card publications available for trade or sale.
        </Typography>
      </Box>

      {/* Filter and Search Section - adapted from template */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' }, // Stack on mobile, row on desktop
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 2,
          mb: 4, // Margin below filters/search
        }}
      >
        {/* Filter Chips */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap', // Allow chips to wrap on smaller screens
            gap: 1,
          }}
        >
          <Chip onClick={handleFilterClick} size="medium" label="All Games" variant="outlined" />
          <Chip onClick={handleFilterClick} size="medium" label="Pokémon TCG" />
          <Chip onClick={handleFilterClick} size="medium" label="Magic: The Gathering" />
          {/* Add more filter chips as needed */}
        </Box>

        {/* Search Bar and Icon - Right side on desktop, below filters on mobile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            width: { xs: '100%', md: 'auto' }, // Full width on mobile
          }}
        >
          <Search />
          <IconButton size="small" aria-label="RSS feed">
            <RssFeedRoundedIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Publications Grid */}
      {/* Add loading indicator here if desired using the 'loading' state */}
      <Grid container spacing={3} > {/* Adjust spacing as needed */}
        {Array.isArray(publications) && publications.length > 0 ? (
          publications.map((publication) => (
            // Adjust grid item sizing for responsiveness
            <Grid item xs={12} sm={6} md={4} key={publication.id}>
              <Publication publication={publication} />
            </Grid>
          ))
        ) : (
          // Handle empty state or loading state
          <Grid item xs={12}>
            <Typography>No publications found.</Typography> {/* Or show loading spinner */}
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ViewPublications;

import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, Box, CardMedia, Chip, Avatar, AvatarGroup } from '@mui/material';
import './publication.scss';

// Author component adapted for single owner and creation date
function Author({ owner, createdAt }) {
  const avatarSrc = owner.avatar || `/static/images/avatar/placeholder.jpg`;
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <Box className="author-container"> {/* Use SCSS class */}
      <Box className="author-info"> {/* Use SCSS class */}
        <AvatarGroup max={1}>
            <Avatar
              alt={owner.ownerName}
              src={avatarSrc}
              className="author-avatar" // Use SCSS class
            />
        </AvatarGroup>
        <Typography variant="caption">
          {owner.ownerName}
        </Typography>
      </Box>
      <Typography variant="caption">{formattedDate}</Typography>
    </Box>
  );
}

Author.propTypes = {
  owner: PropTypes.shape({
    ownerName: PropTypes.string.isRequired,
    avatar: PropTypes.string, // Avatar is optional
  }).isRequired,
  createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
};


// Refactored Publication component using SCSS classes
const Publication = ({ publication }) => {
  const imageUrl = publication.cardImageUrl || 'https://picsum.photos/800/450?random=default';

  return (
      // Apply SCSS class to Card, remove variant="outlined" as border is in SCSS
      <Card className="styled-card" tabIndex={0}>
        <CardMedia
          component="img"
          alt={publication.name}
          image={imageUrl}
          className="card-media" // Use SCSS class
        />
        {/* Apply SCSS class to CardContent */}
        <CardContent className="styled-card-content">
           {/* Apply SCSS class to Chip */}
          <Chip label={publication.game.Name} size="small" className="game-chip" />
          <Typography gutterBottom variant="h6" component="div">
            {publication.name}
          </Typography>
          {/* Apply SCSS class to Typography */}
          <Typography variant="body2" color="text.secondary" gutterBottom className="styled-typography">
             Card: {publication.cardBase.Name}
          </Typography>
        </CardContent>
        <Author owner={publication.owner} createdAt={publication.createdAt} />
      </Card>
  );
};

// PropTypes remain the same
Publication.propTypes = {
  publication: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    cardId: PropTypes.string,
    valueMoney: PropTypes.number,
    cardExchangeIds: PropTypes.arrayOf(PropTypes.string),
    cardBase: PropTypes.shape({
      Id: PropTypes.string,
      Name: PropTypes.string,
    }).isRequired,
    game: PropTypes.shape({
      Id: PropTypes.string,
      Name: PropTypes.string,
    }).isRequired,
    owner: PropTypes.shape({
      ownerId: PropTypes.string,
      ownerName: PropTypes.string.isRequired,
      avatar: PropTypes.string, // Add avatar if you plan to include it in fixture
    }).isRequired,
    offers: PropTypes.array, // Define offer shape if needed
    createdAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    cardImageUrl: PropTypes.string,
  }).isRequired,
};


export default Publication;


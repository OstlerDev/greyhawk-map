import React, { useState } from 'react';
import {
  Paper,
  Collapse,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Typography,
  Box
} from '@mui/material';
import {
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Layers as LayersIcon,
  HexagonIcon
} from '@mui/icons-material';

const LayerToggle = ({ layersVisible, toggleLayer }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [hoverCollapseIcon, setHoverCollapseIcon] = useState(false);

  const handleToggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Paper elevation={4} style={{ position: 'absolute', top: '10px', left: '50px', zIndex: 1500, width: 'auto', maxWidth: '300px' }}>
      <Box 
        onClick={handleToggleExpand} 
        onMouseEnter={() => setHoverCollapseIcon(true)}
        onMouseLeave={() => setHoverCollapseIcon(false)}
        style={{ cursor: 'pointer' }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" padding={1}>
          <Box display="flex" alignItems="center">
            <LayersIcon color="action" style={{ marginRight: 8, color: hoverCollapseIcon ? '#1976d2' : 'inherit' }}/>
            <Typography variant="subtitle1" style={{ color: hoverCollapseIcon ? '#1976d2' : 'inherit' }}>Layers</Typography>
          </Box>
          <Box>
            { 
              isExpanded 
              ? <ExpandLessIcon style={{ color: hoverCollapseIcon ? '#1976d2' : 'inherit' }} /> 
              : <ExpandMoreIcon style={{ color: hoverCollapseIcon ? '#1976d2' : 'inherit' }} />
            }
          </Box>
        </Box>
      </Box>
      <Collapse in={isExpanded}>
        <List>
          {Object.keys(layersVisible).map((layerId) => (
            <ListItem key={layerId} button onClick={(event) => {
              event.stopPropagation(); // Prevent the collapse/expand from triggering when toggling layers
              toggleLayer(layerId, !layersVisible[layerId].visible);
            }}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={layersVisible[layerId].visible}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': `checkbox-label-${layerId}` }}
                  style={{ marginLeft: 2 }}
                />
              </ListItemIcon>
              {layersVisible[layerId].icon}
              <ListItemText id={`checkbox-label-${layerId}`}>{layersVisible[layerId].label}</ListItemText>
            </ListItem>
          ))}
        </List>
      </Collapse>
    </Paper>
  );
};

export default LayerToggle;

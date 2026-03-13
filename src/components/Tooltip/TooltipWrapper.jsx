import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const TooltipWrapper = ({ tooltip, placement = 'top', children }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id={`tooltip-${tooltip.replace(/\s+/g, '-')}`}>{tooltip}</Tooltip>}
    >
      <span style={{ display: 'inline-block' }}>{children}</span>
    </OverlayTrigger>
  );
};

export default TooltipWrapper; 

import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const PageHeader = ({ name, count, handleRefresh }) => {

    const renderTooltip = (props) => (
        <Tooltip id="tooltip-refresh" {...props}>
            Refresh
        </Tooltip>
    );

    return (
        <div className="page-header">
            <div className="row align-items-center">
                <div className="col-12 col-md-4 ">
                    <h4 className="page-title">
                        {name}
                        <span className="count-title">{count}</span>
                    </h4>
                </div>
                <div className="col-8 text-end">
                    <div className="head-icons">
                        <OverlayTrigger placement="top" overlay={renderTooltip}>
                            <a onClick={handleRefresh}>
                                <i className="ti ti-refresh-dot" />
                            </a>
                        </OverlayTrigger>
                        {/* <a href="javascript:void(0);" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
                            <i className="ti ti-chevrons-up" />
                        </a> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageHeader
import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { Receipt, Wrench, Home, FileText, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router';
import { getRoleFlags } from '../../../config/DataFile';

const FastAction = ({ fastActions, role }) => {
    const navigate = useNavigate();

    const userRole = localStorage.getItem('DX_ROLE');
    const roleFlags = getRoleFlags(userRole)
    const { isCompany, isGeneral, isServices, isAccounts, isInstallations } = roleFlags;

    const filteredActions = fastActions.filter(action => {
        if (isGeneral || isCompany) return true; 
        if (isAccounts && action.icon === 'receipt') return true; 
        if (isServices && action.icon === 'build') return true; 
        if (isInstallations && action.icon === 'home_repair_service') return true; 
        return false;
    });

    return (
        <Row className="mb-4">
            {filteredActions.map((action, index) => {
                // Determine accent/icon class
                let accent = 'default', iconClass = 'default', IconComponent = Receipt;
                if (action.icon === 'receipt') { accent = 'po'; iconClass = 'po'; IconComponent = Receipt; }
                if (action.icon === 'build') { accent = 'service'; iconClass = 'service'; IconComponent = Wrench; }
                if (action.icon === 'home_repair_service') { accent = 'install'; iconClass = 'install'; IconComponent = Home; }
                if (action.icon === 'description') { accent = 'default'; iconClass = 'default'; IconComponent = FileText; }

                return (
                    <Col key={index} xl={3} md={6} className="mb-3">
                        <div className={`dashboard-fastaction-card`}>
                            <div className={`dashboard-fastaction-accent ${accent}`} />
                            <div className={`dashboard-fastaction-icon ${iconClass}`}><IconComponent size={22} /></div>
                            <div>
                                <div className="dashboard-fastaction-title">{action.title}</div>
                                <div className="dashboard-fastaction-value">{action.count}</div>
                            </div>
                            {action.count > 0 && (
                                <button
                                    className="dashboard-fastaction-btn ms-auto"
                                    type='button'
                                    onClick={() => navigate(action.action)}
                                >
                                    View <ChevronRight size={16} />
                                </button>
                            )}
                        </div>
                    </Col>
                );
            })}
        </Row>
    )
}

export default FastAction

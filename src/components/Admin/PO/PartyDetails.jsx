import React, { useEffect, useMemo, useState } from 'react'
import { useApi } from '../../../context/ApiContext';
import { getAdminStorage } from '../../LocalStorage/AdminStorage';
import { State, City } from 'country-state-city';
import ShipToSection from './ShipToSection';
import BillToSection from './BillToSection';

const PartyDetails = ({ setBillTo, setShipTo, companyId, billTo, shipTo }) => {
    const { get } = useApi();
    const [states, setStates] = useState([]);
    const [billCities, setBillCities] = useState([]);
    const [shipCities, setShipCities] = useState([]);
    const [partyData, setPartyData] = useState({
        dealers: [],
        customers: []
    });
    const [validationErrors, setValidationErrors] = useState({});

    const [currentBillTo, setCurrentBillTo] = useState(billTo || {
        billType: '',
        billId: null,
        mailName: '',
        address: '',
        state: '',
        city: "",
        pincode: "",
        country: 'India',
        gstRegisterType: 'Registered',
        gstNo: '',
        placeOfSupply: ''
    });

    const [currentShipTo, setCurrentShipTo] = useState(shipTo || {
        shipId: null,
        shipType: '',
        mailName: '',
        address: '',
        state: '',
        city: "",
        pincode: "",
        country: 'India',
        gstRegisterType: 'Registered',
        gstNo: ''
    });

    const firmId = getAdminStorage().DX_AD_FIRM;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dealers, customers] = await Promise.all([
                    get(`/admin/get-dealer?firmId=${firmId}&status=2`),
                    get(`/admin/get-customer?firmId=${firmId}`)
                ]);

                if (dealers.success) setPartyData(prev => ({ ...prev, dealers: dealers.data }));
                if (customers.success) setPartyData(prev => ({ ...prev, customers: customers.data }));
            } catch (error) {
                console.error('Error fetching party data:', error);
            }
        };
        fetchData();
    }, [firmId]);

    useEffect(() => {
        const indianStates = State.getStatesOfCountry("IN");
        setStates(indianStates);
    }, []);

    useEffect(() => {
        if (currentBillTo.state) {
            const selectedState = states?.find(state => state.name === currentBillTo.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setBillCities(cityList);
            } else {
                setBillCities([]);
            }
        } else {
            setBillCities([]);
        }
    }, [currentBillTo.state, states]);

    useEffect(() => {
        if (currentShipTo.state) {
            const selectedState = states?.find(state => state.name === currentShipTo.state);
            if (selectedState) {
                const cityList = City.getCitiesOfState("IN", selectedState.isoCode);
                setShipCities(cityList);
            } else {
                setShipCities([]);
            }
        } else {
            setShipCities([]);
        }
    }, [currentShipTo.state, states]);

    useEffect(() => {
        if (billTo) {
            setCurrentBillTo(billTo);
        }
    }, [billTo]);

    useEffect(() => {
        if (shipTo) {
            setCurrentShipTo(shipTo);
        }
    }, [shipTo]);

    useEffect(() => {
        if (currentShipTo.city && currentBillTo.placeOfSupply !== currentShipTo.city) {
            setCurrentBillTo(prev => {
                const updated = { ...prev, placeOfSupply: currentShipTo.city };
                setBillTo(updated);
                return updated;
            });
        }
    }, [currentShipTo.city]);

    // Create dropdown options for Bill To and Ship To
    const billToOptions = useMemo(() => {
        const options = [];

        partyData.dealers.forEach(dealer => {
            options.push({
                ...dealer,
                type: 'Dealer',
                displayName: dealer.name,
                fullValue: `Dealer|${dealer._id}`
            });
        });

        partyData.customers.forEach(customer => {
            options.push({
                ...customer,
                type: 'Customer',
                displayName: `${customer.title} ${customer.name} ${customer.lastName} (${customer.clinicName})`,
                fullValue: `Customer|${customer._id}`
            });
        });

        return options;
    }, [partyData]);

    const shipToOptions = useMemo(() => {
        const options = [];

        partyData.dealers.forEach(dealer => {
            options.push({
                ...dealer,
                type: 'Dealer',
                displayName: dealer.name,
                fullValue: `Dealer|${dealer._id}`
            });
        });

        partyData.customers.forEach(customer => {
            options.push({
                ...customer,
                type: 'Customer',
                displayName: `${customer.title} ${customer.name} ${customer.lastName} (${customer.clinicName})`,
                fullValue: `Customer|${customer._id}`
            });
        });

        return options;
    }, [partyData]);

    const isIGST = useMemo(() => {
        return (
            currentBillTo.state &&
            currentShipTo.state &&
            currentBillTo.state.trim().toLowerCase() !== currentShipTo.state.trim().toLowerCase()
        );
    }, [currentBillTo.state, currentShipTo.state]);

    const getGstRegisterType = (entity) => {
        // Priority 1: If GST number exists, always Registered
        if (entity.gstNo && entity.gstNo.trim() !== '') {
            return 'Registered';
        }

        // Priority 2: Check explicit flag
        if (entity.isRegistrationType !== undefined) {
            return entity.isRegistrationType === 1 ? 'Registered' : 'Unregistered';
        }

        // Default: Unregistered
        return 'Unregistered';
    };


    const validateField = (field, value, section) => {
        const errors = { ...validationErrors };
        const key = `${section}.${field}`;

        switch (field) {
            case 'mailName':
                if (!value || value.trim() === '') {
                    errors[key] = 'Mail name is required';
                } else {
                    delete errors[key];
                }
                break;
            case 'address':
                if (!value || value.trim() === '') {
                    errors[key] = 'Address is required';
                } else {
                    delete errors[key];
                }
                break;
            case 'state':
                if (!value) {
                    errors[key] = 'State is required';
                } else {
                    delete errors[key];
                }
                break;
            case 'city':
                if (!value) {
                    errors[key] = 'City is required';
                } else {
                    delete errors[key];
                }
                break;
            case 'pincode':
                if (!value) {
                    errors[key] = 'Pincode is required';
                } else if (!/^\d{6}$/.test(value)) {
                    errors[key] = 'Pincode must be 6 digits';
                } else {
                    delete errors[key];
                }
                break;
            case 'gstNo':
                if (section === 'billTo' && currentBillTo.gstRegisterType === 'Registered' && !value) {
                    errors[key] = 'GST number is required for registered entities';
                } else if (section === 'shipTo' && currentShipTo.gstRegisterType === 'Registered' && !value) {
                    errors[key] = 'GST number is required for registered entities';
                } else if (value && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(value)) {
                    errors[key] = 'Invalid GST number format';
                } else {
                    delete errors[key];
                }
                break;
            default:
                break;
        }

        setValidationErrors(errors);
    };

    const updateBillToFields = (selectedEntity, type) => {
        if (!selectedEntity) return;

        const gstType = getGstRegisterType(selectedEntity);

        const newBillTo = {
            billId: selectedEntity._id,
            billType: type,
            mailName: type === "Dealer" ? selectedEntity.name : `${selectedEntity.title} ${selectedEntity.name} ${selectedEntity.lastName}`,
            address: `${selectedEntity.address || ''} ${selectedEntity.addressTwo || ''} ${selectedEntity.addressThree || ''}`.trim(),
            state: selectedEntity.state,
            city: selectedEntity.city || '',
            pincode: selectedEntity.pincode || '',
            country: "India",
            gstRegisterType: gstType,
            gstNo: selectedEntity.gstNo || '',
            // placeOfSupply: selectedEntity.state
            placeOfSupply: currentShipTo.city || selectedEntity.city || ''
        };
        setCurrentBillTo(newBillTo);
        setBillTo(newBillTo);
    };

    const updateShipToFields = (selectedEntity, type) => {
        if (!selectedEntity) return;

        const gstType = getGstRegisterType(selectedEntity);

        const newShipTo = {
            shipId: selectedEntity._id,
            shipType: type,
            mailName: type === "Dealer" ? selectedEntity.name : `${selectedEntity.title} ${selectedEntity.name} ${selectedEntity.lastName}`,
            address: `${selectedEntity.address || ''} ${selectedEntity.addressTwo || ''} ${selectedEntity.addressThree || ''}`.trim(),
            state: selectedEntity.state,
            city: selectedEntity.city || '',
            pincode: selectedEntity.pincode || '',
            country: "India",
            gstRegisterType: gstType,
            gstNo: selectedEntity.gstNo || ''
        };
        setCurrentShipTo(newShipTo);
        setShipTo(newShipTo);
    };

    const handleBillToFieldChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...currentBillTo, [name]: value };

        if (name === 'gstRegisterType' && value === 'Unregistered') {
            updated.gstNo = '';
        }

        if (name === 'state') {
            updated.city = '';
        }

        setCurrentBillTo(updated);
        setBillTo(updated);
        validateField(name, value, 'billTo');
    };

    const handleShipToFieldChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...currentShipTo, [name]: value };

        if (name === 'gstRegisterType' && value === 'Unregistered') {
            updated.gstNo = '';
        }
        if (name === 'state') {
            updated.city = '';
        }

        setCurrentShipTo(updated);
        setShipTo(updated);
        validateField(name, value, 'shipTo');
    };

    return (
        <div className="card">
            <div className="card-header">
                <h4 className="page-title">Party Details</h4>
            </div>
            <div className="card-body">
                <div className="row">
                    <BillToSection
                        currentBillTo={currentBillTo}
                        billToOptions={billToOptions}
                        handleBillToFieldChange={handleBillToFieldChange}
                        states={states}
                        billCities={billCities}
                        updateBillToFields={updateBillToFields}
                        validationErrors={validationErrors}
                    />

                    <ShipToSection
                        currentShipTo={currentShipTo}
                        shipToOptions={shipToOptions}
                        states={states}
                        shipCities={shipCities}
                        isIGST={isIGST}
                        handleShipToFieldChange={handleShipToFieldChange}
                        updateShipToFields={updateShipToFields}
                        validationErrors={validationErrors}
                    />
                </div>
            </div>
        </div>
    );
};

export default PartyDetails;
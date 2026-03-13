import React, { useEffect, useState } from 'react';
import moment from 'moment';

const CustomInstallation = ({ dynamicFields, checklistFields, values, setValues }) => {
  const [groupedFields, setGroupedFields] = useState({});

  useEffect(() => {
    const grouped = dynamicFields.reduce((acc, field) => {
      const category = field.category || 'Uncategorized';
      if (!acc[category]) acc[category] = [];
      acc[category].push(field);
      return acc;
    }, {});
    setGroupedFields(grouped);
  }, [dynamicFields]);

  useEffect(() => {

    const allFields = [
      ...dynamicFields,
      ...checklistFields  
    ];

    const initialValues = allFields.reduce((acc, field) => {
      const { key, inputType, label, unit, category, type, options } = field;
  
      let defaultValue;
      if (inputType === 'checkbox') defaultValue = false;
      else defaultValue = ''; 
  
      acc[key] = {
        label,
        value: values[key]?.value ?? defaultValue, 
        unit: unit || '',
        category: category || 'Uncategorized',
        type,
        inputType,
        options: options || []
      };
  
      return acc;
    }, {});
  
    setValues(prev => {
      const merged = { ...prev, ...initialValues };
      Object.keys(initialValues).forEach(k => {
        if (prev[k] && prev[k].value !== undefined && prev[k].value !== '') {
          merged[k] = { ...initialValues[k], value: prev[k].value };
        } else {
          merged[k] = initialValues[k];
        }
      });
      return merged;
    });
  }, [dynamicFields]);

  const handleChange = (field, e) => {
    const { key, inputType } = field;
    let value;

    switch (inputType) {
      case 'checkbox':
        value = e.target.checked;
        break;
      case 'radio':
        value = e.target.value;
        break;
      case 'number':
        value = e.target.value === '' ? '' : Number(e.target.value);
        break;
      case 'date':
        value = e.target.value ? moment(e.target.value, 'YYYY-MM-DD').toISOString() : '';
        break;
      default:
        value = e.target.value;
    }

    setValues(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        label: field.label,
        value,
        unit: field.unit || '',
        category: field.category || '',
        type: field.type,
        inputType: field.inputType,
        options: field.options || []
      },
    }));
  };

  return (
    <div className="mb-4">
      {Object.keys(groupedFields).map(category => (
        <div key={category} className="mb-4">
          <h5 className="text-primary border-bottom pb-1 mb-3">{category}</h5>
          <div className="row">
            {groupedFields[category].map((field) => {
              const { key, label, inputType, options, unit, placeholder } = field;
              const fieldValue = values[key]?.value ?? (inputType === 'checkbox' ? false : '');

              return (
                <div className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3" key={key}>
                  {/* Checkbox */}
                  {inputType === 'checkbox' ? (
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        checked={!!fieldValue}
                        onChange={e => handleChange(field, e)}
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {label} {unit && `(${unit})`}
                      </label>
                    </div>
                  ) : inputType === 'radio' && options ? (
                    <div>
                      <label className="form-label">{label} {unit && `(${unit})`}</label>
                      <div>
                        {options.map(opt => (
                          <div className="form-check form-check-inline" key={opt}>
                            <input
                              type="radio"
                              name={key}
                              value={opt}
                              checked={fieldValue === opt}
                              onChange={e => handleChange(field, e)}
                              className="form-check-input"
                              id={`${key}_${opt}`}
                            />
                            <label className="form-check-label" htmlFor={`${key}_${opt}`}>
                              {opt}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : inputType === 'select' && options ? (
                    <div className="form-floating">
                      <select
                        className="form-select"
                        id={key}
                        value={fieldValue}
                        onChange={e => handleChange(field, e)}
                      >
                        <option value="">Select {label}</option>
                        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                      <label htmlFor={key}>{label} {unit && `(${unit})`}</label>
                    </div>
                  ) : inputType === 'textarea' ? (
                    <div className="form-floating">
                      <textarea
                        className="form-control"
                        id={key}
                        value={fieldValue}
                        onChange={e => handleChange(field, e)}
                        placeholder={placeholder || label}
                        rows={3}
                      />
                      <label htmlFor={key}>{label} {unit && `(${unit})`}</label>
                    </div>
                  ) : inputType === 'date' ? (
                    <div className="form-floating">
                      <input
                        type="date"
                        className="form-control"
                        id={key}
                        value={fieldValue ? moment(fieldValue).format('YYYY-MM-DD') : ''}
                        onChange={e => handleChange(field, e)}
                        placeholder={placeholder || label}
                      />
                      <label htmlFor={key}>{label} {unit && `(${unit})`}</label>
                    </div>
                  ) : (
                    <div className="form-floating">
                      <input
                        type={inputType || 'text'}
                        className="form-control"
                        id={key}
                        value={fieldValue}
                        onChange={e => handleChange(field, e)}
                        placeholder={placeholder || label}
                      />
                      <label htmlFor={key}>{label} {unit && `(${unit})`}</label>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomInstallation;

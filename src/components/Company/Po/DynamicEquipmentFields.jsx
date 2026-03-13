import React, { useEffect, useState } from "react";
import axios from "axios";
import { DX_URL } from "../../../config/baseUrl";
import { getCompanyStorage } from "../../LocalStorage/CompanyStorage";

const DynamicEquipmentFields = ({
  productsData,
  setProductsData,
  validateStatus,
}) => {
  const [equipmentAttributes, setEquipmentAttributes] = useState([]);

  const companyStorage = getCompanyStorage()

  const normalizeKey = (key = "") => key.replace(/[-_\s]/g, "").toLowerCase();
  const toCamelCase = (key = "") =>
    key
      .toLowerCase()
      .replace(/[-_\s](\w)/g, (_, c) => c.toUpperCase())
      .replace(/[^a-zA-Z0-9]/g, "");

  useEffect(() => {
    const fetchEquipmentAttributes = async () => {
      try {
        const response = await axios.get(
          `${DX_URL}/admin/get-attribute?category=Equipment Attributes&companyId=${companyStorage?.comId}`,
          {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (response.data?.success) {
          const attributes = response?.data?.data?.attributes || [];
          setEquipmentAttributes(
            attributes.map((attr) => ({
              ...attr,
              normalizedKey: normalizeKey(attr.key),
              camelKey: toCamelCase(attr.key),
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching equipment attributes:", error);
      }
    };

    fetchEquipmentAttributes();
  }, []);

  const groupedAttributes = equipmentAttributes.reduce((acc, attr) => {
    const label = attr.label.trim().toLowerCase();
    if (!acc[label]) acc[label] = [];
    acc[label].push(attr);
    return acc;
  }, {});

  const renderHeaders = () => {
    if (!validateStatus) return null;
    return Object.keys(groupedAttributes).map((label) => (
      <th key={label}>{groupedAttributes[label][0].label}</th>
    ));
  };

  const renderRowCells = (item, index) => {
    if (!validateStatus) return null;

    const normalizedProductAttrs = {};
    for (const [key, value] of Object.entries(item.productAttributes || {})) {
      normalizedProductAttrs[normalizeKey(key)] = value;
    }

    return Object.keys(groupedAttributes).map((label) => {
      const fields = groupedAttributes[label];

      if (fields.length > 1) {
        const camelBaseKey = toCamelCase(fields[0].key.replace(/[0-9]+$/, "")); 
      
        let baseValue = normalizedProductAttrs[normalizeKey(camelBaseKey)] || normalizedProductAttrs[camelBaseKey];
        if (!Array.isArray(baseValue)) baseValue = Array.isArray(baseValue) ? baseValue : [];
      
        return (
          <td key={label}>
            <div className="d-flex flex-column gap-1">
              {fields.map((field, i) => {
                const value = baseValue[i] || "";
      
                const handleChange = (e) => {
                  const updated = [...productsData];
                  const newArray = [...baseValue];
                  newArray[i] = e.target.value;
      
                  updated[index] = {
                    ...updated[index],
                    productAttributes: {
                      ...updated[index].productAttributes,
                      [camelBaseKey]: newArray, 
                    },
                  };
                  setProductsData(updated);
                };
      
                return (
                  <input
                    key={`${field.key}_${i}`}
                    type={field.inputType || "text"}
                    className="form-control form-control-sm"
                    value={value}
                    onChange={handleChange}
                  />
                );
              })}
            </div>
          </td>
        );
      }
      

      const field = fields[0];
      const normalizedFieldKey = normalizeKey(field.key);
      const camelKey = toCamelCase(field.key);

      const value =
        normalizedProductAttrs[normalizedFieldKey] ??
        normalizedProductAttrs[camelKey] ??
        "";

      const handleChange = (e) => {
        const updated = [...productsData];
        let newValue;
        switch (field.inputType) {
          case "checkbox":
            newValue = e.target.checked;
            break;
          case "number":
            newValue = e.target.value === "" ? "" : Number(e.target.value);
            break;
          default:
            newValue = e.target.value;
        }

        updated[index] = {
          ...updated[index],
          productAttributes: {
            ...updated[index].productAttributes,
            [camelKey]: newValue, 
          },
        };
        setProductsData(updated);
      };

      return (
        <td key={label}>
          {field.inputType === "checkbox" ? (
            <input
              type="checkbox"
              className="form-check-input"
              checked={!!value}
              onChange={handleChange}
            />
          ) : field.inputType === "select" ? (
            <select
              className="form-select form-select-sm"
              value={value}
              onChange={handleChange}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          ) : (
            <input
              type={field.inputType || "text"}
              className="form-control form-control-sm"
              value={value}
              onChange={handleChange}
            />
          )}
        </td>
      );
    });
  };

  return { renderHeaders, renderRowCells };
};

export default DynamicEquipmentFields;

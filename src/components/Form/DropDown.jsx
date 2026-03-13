import React from "react";
import { Dropdown } from 'react-bootstrap';

const DropDown = ({ limit, onLimitChange }) => {
    return (
        <>
            <Dropdown>
                <Dropdown.Toggle
                    variant="none"
                    id="dropdown-basic"
                    style={{
                        cursor: "auto",
                        backgroundColor: "white",
                        borderColor: "#d5dbe0",
                        paddingBottom: "3px",
                        paddingTop: "3px",
                    }}
                    className="form-select-limit form-select-sm mx-2"
                >
                    {limit}&nbsp;
                </Dropdown.Toggle>
                <Dropdown.Menu>

                    {[10, 20, 30, 50].map((option) => (
                        <Dropdown.Item
                            key={option}
                            onClick={() => onLimitChange(option)}
                        >
                            {option}
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown>
        </>
    );
};

export default DropDown;

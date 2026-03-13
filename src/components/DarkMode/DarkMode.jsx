import React, { useEffect, useState } from 'react'
import { Link } from 'react-router'

const DarkMode = () => {

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('darkMode') === 'enabled';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('darkMode', 'disabled');
        }
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
    };


    return (
        <li className="dark-mode-list">
            <button
                // id="dark-mode-toggle"
                className="dark-mode-toggle"
                onClick={toggleDarkMode}
                style={{ cursor: 'pointer' }}
            >
                <i className={`ti ti-sun light-mode ${!darkMode ? 'active' : ''}`} />
                <i className={`ti ti-moon dark-mode ${darkMode ? 'active' : ''}`} />
            </button>
        </li>
    )
}

export default DarkMode
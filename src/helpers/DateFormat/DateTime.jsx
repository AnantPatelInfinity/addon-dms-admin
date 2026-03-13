import React, { useEffect, useState } from 'react';
import { formatIndianDateTime, getCurrentIndianTime } from './dateTimeHelper';
import moment from 'moment-timezone';

const DateTime = ({
    value,
    format = 'full',
    liveUpdate = false,
    className = '',
    style = {},
    showTimezone = false
}) => {
    const [currentValue, setCurrentValue] = useState(
        value ? moment(value) : getCurrentIndianTime()
    );
    const [formattedDateTime, setFormattedDateTime] = useState('');

    useEffect(() => {
        // Format the initial value
        setFormattedDateTime(formatIndianDateTime(currentValue, format));

        // Set up live updates if enabled
        let intervalId;
        if (liveUpdate || !value) {
            intervalId = setInterval(() => {
                const now = getCurrentIndianTime();
                setCurrentValue(now);
                setFormattedDateTime(formatIndianDateTime(now, format));
            }, 1000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [value, format, liveUpdate]);

    return (
        <time
            dateTime={currentValue.format()}
            className={`date-time ${className}`}
            style={style}
            title={showTimezone ? 'Indian Standard Time (IST)' : undefined}
        >
            {formattedDateTime}
            {showTimezone && ' IST'}
        </time>
    );
};

export default DateTime;
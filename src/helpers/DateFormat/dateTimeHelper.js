import moment from 'moment-timezone';

/**
 * Formats a date/time value to Indian timezone (IST)
 * @param {Date|string|number|moment.Moment} dateValue - Input date
 * @param {string} formatType - Format type (full, dateOnly, timeOnly, etc.)
 * @returns {string} Formatted date/time string
 */
export const formatIndianDateTime = (dateValue, formatType = 'full') => {
    if (!dateValue) return '';

    const m = moment(dateValue);
    if (!m.isValid()) return 'Invalid Date';

    // Convert to IST timezone
    const istTime = m.tz('Asia/Kolkata');

    const formatMap = {
        full: 'dddd, MMMM D, YYYY hh:mm:ss A',
        dateOnly: 'MMMM D, YYYY',
        dateTime: 'DD-MM-YYYY hh:mm:ss A',
        date: "DD-MM-YYYY",
        timeOnly: 'hh:mm:ss A',
        shortDate: 'MMM D, YYYY',
        numericDate: 'D/M/YYYY',
        timeWithSeconds: 'hh:mm:ss A',
        timeWithoutSeconds: 'hh:mm A',
        monthYear: 'MMMM YYYY',
        iso: 'YYYY-MM-DDTHH:mm:ss',
        isoDate: 'YYYY-MM-DD',
        isoTime: 'HH:mm:ss'
    };

    const formatString = formatMap[formatType] || formatMap.full;
    return istTime.format(formatString);
};

/**
 * Gets current date/time in Indian timezone (IST)
 * @returns {moment.Moment} Current moment object in IST
 */
export const getCurrentIndianTime = () => {
    return moment().tz('Asia/Kolkata');
};

/**
 * Converts a date to Indian timezone
 * @param {Date|string|number|moment.Moment} date - Input date
 * @returns {moment.Moment} Moment object in IST
 */
export const convertToIndianTime = (date) => {
    return moment(date).tz('Asia/Kolkata');
};

/**
 * Helper to get duration between two dates
 * @param {Date|string|moment.Moment} start - Start date
 * @param {Date|string|moment.Moment} end - End date
 * @returns {moment.Duration} Duration object
 */
export const getDuration = (start, end) => {
    return moment.duration(moment(end).diff(moment(start)));
};

/**
 * Formats a duration in human-readable format
 * @param {moment.Duration} duration - Duration object
 * @returns {string} Human-readable duration
 */
export const formatDuration = (duration) => {
    return duration.humanize();
};
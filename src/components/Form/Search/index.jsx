import React, { useState } from 'react';

const Search = ({ onSearch, placeholder = 'Search here' }) => {
    const [search, setSearch] = useState('');

    const onInputChange = (value) => {
        setSearch(value);
        onSearch(value);
    };
    return (
        <input
            type="text"
            className="form-control"
            placeholder={placeholder}
            value={search}
            onChange={(e) => onInputChange(e.target.value)}
        />
    );
};

export default Search;
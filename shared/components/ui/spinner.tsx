import React from 'react';

export const Spinner = () => (
    <svg
        role="img"
        aria-label="Loading spinner"
        data-testid="spinner"
        className="w-4 h-4 animate-spin"
        viewBox="0 0 24 24"
    >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l5-5-5-5v4a10 10 0 100 20v-4l-5 5 5 5v-4a8 8 0 01-8-8z"
        />
    </svg>
);
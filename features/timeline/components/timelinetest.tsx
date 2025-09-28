import React from "react";

export const TimelineTest = () => {
    const TIMELINE_HEIGHT = 600;

    return (
        <div
            style={{
                position: "relative",
                height: "600px",
                width: "256px",
                borderLeft: "4px solid #374151", // dark gray vertical line
                marginLeft: "40px",
                userSelect: "none",
                backgroundColor: "#f9fafb", // light gray background so line stands out
            }}
        >
            {[...Array(6)].map((_, i) => {
                const year = 2020 + i;
                const top = (i / 5) * TIMELINE_HEIGHT;
                return (
                    <div
                        key={year}
                        style={{
                            position: "absolute",
                            left: "-80px",
                            top: `${top}px`,
                            color: "#4b5563", // gray-600
                            fontWeight: 600,
                            fontSize: "14px",
                            userSelect: "none",
                        }}
                    >
                        {year}
                    </div>
                );
            })}
        </div>
    );
};

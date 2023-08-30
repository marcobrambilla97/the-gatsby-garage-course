import { Link } from "gatsby";
import React from "react";

export const CallToActionButton = ({ label, destination, fullWidth, isActive }) => {
    return (
        <Link
            to={destination}
            className={
                `
                ${isActive ? "cursor-default bg-yellow-400" : ""}
                ${fullWidth ? "block" : "inline-block"}
                 text-center !text-black cursor-pointer bg-yellow-500 py-2 px-4 font-bold uppercase no-underline rounded-sm hover:bg-yellow-400 transition-colors
                 `
            }
        >
            {label}
        </Link>
    )
}
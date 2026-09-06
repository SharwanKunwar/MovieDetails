import React from "react";
import { Modal } from "antd";
import {
    CalendarDays,
    Clock3,
    Star,
    Tag,
    X,
} from "lucide-react";

import { useTheme } from "../theme/ThemeContext";
import { serif, sans } from "../theme/Themes";

function MovieDetailsModal({ movie, open, onClose }) {
    const { theme } = useTheme();

    if (!movie) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            width={850}
            closeIcon={
                <X
                    size={18}
                    strokeWidth={1.5}
                    style={{
                        color: theme.textFaint,
                    }}
                />
            }
            styles={{
                mask: {
                    background: "rgba(0, 0, 0, 0.7)",
                    backdropFilter: "blur(6px)",
                },

                content: {
                    background: theme.panelSolid,
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow,
                    padding: 0,
                    borderRadius: "12px",
                    overflow: "hidden",
                },

                header: {
                    display: "none",
                },

                body: {
                    padding: 0,
                    background: theme.panelSolid,
                },
            }}
        >
            <div
                className="flex flex-col md:flex-row"
                style={{
                    background: theme.panelSolid,
                }}
            >
                {/* Poster */}
                <div className="md:w-[38%] h-[420px] md:h-[500px] shrink-0">
                    <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            e.currentTarget.src =
                                "/slider_img/d01.jpeg";
                        }}
                    />
                </div>

                {/* Details */}
                <div className="flex-1 p-7 flex flex-col">
                    {/* Genre */}
                    <div className="flex items-center gap-2 mb-3">
                        <span
                            className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-[0.15em]"
                            style={{
                                fontFamily: sans,
                                color: theme.accent,
                                background:
                                    theme.accentSoft,
                                border: `1px solid ${theme.border}`,
                            }}
                        >
                            {movie.genre}
                        </span>
                    </div>

                    {/* Title */}
                    <h1
                        className="text-3xl md:text-4xl leading-tight"
                        style={{
                            fontFamily: serif,
                            color: theme.text,
                        }}
                    >
                        {movie.title}
                    </h1>

                    {/* Description */}
                    <p
                        className="mt-5 text-sm leading-7"
                        style={{
                            fontFamily: sans,
                            color: theme.textDim,
                        }}
                    >
                        {movie.description ||
                            "No description available for this movie."}
                    </p>

                    {/* Movie Stats */}
                    <div
                        className="grid grid-cols-2 gap-3 mt-7"
                    >
                        {/* Rating */}
                        <InfoItem
                            icon={Star}
                            label="IMDB Rating"
                            value={`${movie.rating}/10`}
                            theme={theme}
                        />

                        {/* Runtime */}
                        <InfoItem
                            icon={Clock3}
                            label="Runtime"
                            value={
                                movie.length
                                    ? `${movie.length} min`
                                    : "N/A"
                            }
                            theme={theme}
                        />

                        {/* Release */}
                        <InfoItem
                            icon={CalendarDays}
                            label="Release Date"
                            value={
                                movie.releaseDate
                                    ? new Date(
                                        movie.releaseDate
                                    ).toLocaleDateString()
                                    : "N/A"
                            }
                            theme={theme}
                        />

                        {/* Year */}
                        <InfoItem
                            icon={Tag}
                            label="Year"
                            value={
                                movie.year || "N/A"
                            }
                            theme={theme}
                        />
                    </div>

                    {/* Bottom */}
                    <div
                        className="mt-auto pt-6"
                        style={{
                            borderTop: `1px solid ${theme.border}`,
                        }}
                    >
                        <button
                            onClick={onClose}
                            className="w-full py-2.5 rounded-sm text-sm transition-all duration-300"
                            style={{
                                fontFamily: sans,
                                background: theme.accent,
                                border: `1px solid ${theme.accent}`,
                                color: theme.panelSolid,
                            }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

function InfoItem({
    icon: Icon,
    label,
    value,
    theme,
}) {
    return (
        <div
            className="p-3 rounded-sm"
            style={{
                background: theme.panel,
                border: `1px solid ${theme.border}`,
            }}
        >
            <div className="flex items-center gap-2">
                <Icon
                    size={15}
                    strokeWidth={1.5}
                    style={{
                        color: theme.accent,
                    }}
                />

                <span
                    className="text-[10px] uppercase tracking-wider"
                    style={{
                        fontFamily: sans,
                        color: theme.textFaint,
                    }}
                >
                    {label}
                </span>
            </div>

            <p
                className="mt-2 text-sm"
                style={{
                    fontFamily: sans,
                    color: theme.text,
                }}
            >
                {value}
            </p>
        </div>
    );
}

export default MovieDetailsModal;
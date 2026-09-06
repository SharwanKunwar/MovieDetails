
import { ArrowRight, Trash2 } from "lucide-react";
import { Modal, Button } from "antd";

import { useTheme } from "../theme/ThemeContext";
import { serif, sans } from "../theme/Themes";

function MovieCard({ movie, onDetails, onDelete }) {
    const { theme } = useTheme();

    const handleDelete = () => {
        Modal.confirm({
            title: "Delete Movie?",
            content: `Are you sure you want to delete "${movie.title}"?`,
            okText: "Delete",
            cancelText: "Cancel",
            centered: true,
            okButtonProps: {
                danger: true,
            },
            onOk: () => {
                return onDelete(movie);
            },
        });
    };

    return (
        <div
            className="group w-full overflow-hidden rounded-sm transition-all duration-300"
            style={{
                background: theme.panel,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
            }}
        >
            {/* Poster */}
            <div className="w-full h-72 overflow-hidden">
                <img
                    src={movie.poster}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                        e.currentTarget.src = "/slider_img/d01.jpeg";
                    }}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h3
                    className="text-lg font-medium truncate"
                    style={{
                        fontFamily: serif,
                        color: theme.text,
                    }}
                >
                    {movie.title}
                </h3>



                {/* Actions */}
                <div className="mt-4 flex gap-2">

                    {/* Details */}
                    <button
                        onClick={() => onDetails(movie)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-sm text-sm transition-all duration-300"
                        style={{
                            fontFamily: sans,
                            color: theme.text,
                            background: theme.accentSoft,
                            border: `1px solid ${theme.border}`,
                        }}
                    >
                        Details

                        <ArrowRight
                            size={15}
                            strokeWidth={1.5}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </button>

                    {/* Delete */}
                    <Button
                        size="large"
                        onClick={handleDelete}
                        aria-label={`Delete ${movie.title}`}
                        className="
                            w-11
                            flex
                            items-center
                            justify-center
                            rounded-sm
                            transition-all
                            duration-300
                            hover:bg-indigo-400!
                            hover:text-white!
                            hover:border-indigo-400!
                        "
                        style={{
                            color: theme.textDim,
                            background: theme.panel,
                            border: `1px solid ${theme.border}`,
                        }}
                    >
                        <Trash2
                            size={16}
                            strokeWidth={1.5}
                        />
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;


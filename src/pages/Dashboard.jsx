import { useState, useEffect, useMemo } from "react";

import { motion } from "motion/react";

import {
    BarChart,
    Bar,
    LineChart,
    Line,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

import {
    Search,
    TrendingUp,
    Star,
    Film,
    Calendar,
    X,
} from "lucide-react";

import ImageSlider from "../components/ImageSlider";

import { useTheme } from "../theme/ThemeContext";
import { serif, sans } from "../theme/Themes";

import { Button, Modal } from "antd";


const API_URL =
    "http://localhost:8080/api/movies/all";

const ADD_MOVIE_URL =
    "http://localhost:8080/api/movies/create";


const fallbackImages = [
    "/slider_img/d01.jpeg",
    "/slider_img/d02.jpeg",
    "/slider_img/d03.jpeg",
    "/slider_img/d04.jpeg",
    "/slider_img/d05.jpeg",
    "/slider_img/d06.jpeg",
    "/slider_img/d07.jpeg",
    "/slider_img/d08.jpeg",
    "/slider_img/d09.jpeg",
    "/slider_img/d10.jpeg",
    "/slider_img/d13.jpeg",
    "/slider_img/d15.jpeg",
    "/slider_img/d16.jpeg",
    "/slider_img/d17.jpeg",
    "/slider_img/d19.jpeg",
    "/slider_img/d21.jpeg",
    "/slider_img/d22.jpeg",
    "/slider_img/d23.jpeg",
    "/slider_img/d24.jpeg",
    "/slider_img/d25.jpeg",
    "/slider_img/d26.jpeg",
    "/slider_img/d27.jpeg",
    "/slider_img/d29.jpeg",
    "/slider_img/d30.jpeg",
    "/slider_img/d31.jpeg",
    "/slider_img/d32.jpeg",
];


// --------------------------------------------------
// Normalize Movie
// --------------------------------------------------

function normalizeMovie(raw) {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description ?? "",
        genre: raw.genre ?? "UNKNOWN",
        releaseDate: raw.releaseDate ?? null,
        year: raw.releaseDate
            ? new Date(raw.releaseDate).getFullYear()
            : 0,
        rating: raw.imdbRating ?? 0,
        length: raw.length ?? 0,
        poster: raw.posterUrl ?? null,
        deleted: raw.deleted ?? false,
    };
}


// --------------------------------------------------
// Movies Hook
// --------------------------------------------------

function useMovies() {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMovies = () => {
        setLoading(true);

        return fetch(API_URL)
            .then((res) => {
                if (!res.ok) {
                    throw new Error(`API responded ${res.status}`);
                }

                return res.json();
            })
            .then((data) => {
                const list = Array.isArray(data)
                    ? data
                    : data.movies ??
                    data.data ??
                    data.content ??
                    [];

                setMovies(
                    list
                        .map(normalizeMovie)
                        .filter((movie) => !movie.deleted)
                );

                setError(null);
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        let cancelled = false;

        fetchMovies().then(() => {
            if (cancelled) return;
        });

        return () => {
            cancelled = true;
        };
    }, []);

    return {
        movies,
        loading,
        error,
        refetch: fetchMovies,
    };
}


// --------------------------------------------------
// Stat Card
// --------------------------------------------------

function StatCard({
    icon: Icon,
    label,
    value,
    theme,
}) {
    return (
        <div
            className="rounded-sm p-4 flex items-center gap-3 transition-colors duration-500"
            style={{
                background: theme.panel,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
            }}
        >
            <div
                className="p-2 rounded-sm"
                style={{
                    background: theme.accentSoft,
                    color: theme.accent,
                }}
            >
                <Icon
                    size={18}
                    strokeWidth={1.5}
                />
            </div>

            <div>
                <p
                    className="text-xs uppercase tracking-wide"
                    style={{
                        fontFamily: sans,
                        color: theme.textFaint,
                    }}
                >
                    {label}
                </p>

                <p
                    className="text-lg"
                    style={{
                        fontFamily: serif,
                        color: theme.text,
                    }}
                >
                    {value}
                </p>
            </div>
        </div>
    );
}


// --------------------------------------------------
// Chart Card
// --------------------------------------------------

function ChartCard({
    title,
    theme,
    children,
}) {
    return (
        <div
            className="rounded-sm p-4 h-64 transition-colors duration-500"
            style={{
                background: theme.panel,
                border: `1px solid ${theme.border}`,
                boxShadow: theme.shadow,
            }}
        >
            <p
                className="text-sm mb-2"
                style={{
                    fontFamily: sans,
                    color: theme.textDim,
                }}
            >
                {title}
            </p>

            {children}
        </div>
    );
}


// --------------------------------------------------
// Form Field
// --------------------------------------------------

function Field({
    label,
    theme,
    children,
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label
                className="text-[10px] uppercase tracking-[0.15em]"
                style={{
                    fontFamily: sans,
                    color: theme.textFaint,
                }}
            >
                {label}
            </label>

            {children}
        </div>
    );
}


// --------------------------------------------------
// Empty Movie
// --------------------------------------------------

const EMPTY_MOVIE = {
    title: "",
    description: "",
    genre: "",
    releaseDate: "",
    imdbRating: "",
    length: "",
    posterUrl: "",
};


// --------------------------------------------------
// Add Movie Modal
// --------------------------------------------------

function AddMovieModal({
    open,
    onClose,
    onAdded,
    theme,
}) {
    const [form, setForm] =
        useState(EMPTY_MOVIE);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState(null);


    useEffect(() => {
        if (open) {
            setForm(EMPTY_MOVIE);
            setError(null);
        }
    }, [open]);


    const update = (field) => (e) => {
        setForm((previous) => ({
            ...previous,
            [field]: e.target.value,
        }));
    };


    const handleSubmit = async () => {
        if (!form.title.trim()) {
            setError("Title is required");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const payload = {
                title: form.title,
                description: form.description,
                genre: form.genre || "UNKNOWN",
                releaseDate:
                    form.releaseDate || null,
                imdbRating: form.imdbRating
                    ? Number(form.imdbRating)
                    : 0,
                length: form.length
                    ? Number(form.length)
                    : 0,
                posterUrl:
                    form.posterUrl || null,
            };


            const res = await fetch(
                ADD_MOVIE_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(payload),
                }
            );


            if (!res.ok) {
                throw new Error(
                    `Failed to add movie (${res.status})`
                );
            }


            onAdded?.();
            onClose();

        } catch (err) {
            setError(err.message);

        } finally {
            setSubmitting(false);
        }
    };


    const inputClass =
        "w-full text-sm rounded-sm px-3 py-2.5 outline-none transition-all duration-300";


    const inputStyle = {
        fontFamily: sans,
        background: theme.inputBg,
        border: `1px solid ${theme.border}`,
        color: theme.text,
    };


    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            centered
            destroyOnClose
            width={600}

            closeIcon={
                <X
                    size={17}
                    strokeWidth={1.5}
                    style={{
                        color: theme.textFaint,
                    }}
                />
            }

            title={
                <div>
                    <p
                        className="text-2xl font-medium text-shadow-sm text-black"
                        style={{
                            fontFamily: serif,
                            color: theme.text,
                        }}
                    >
                        Add Movie
                    </p>

                    <p
                        className="text-xs mt-1 font-semibold text-shadow-sm text-black"
                        style={{
                            fontFamily: sans,
                            color: theme.textFaint,
                        }}
                    >
                        Add a new movie to your
                        collection.
                    </p>
                </div>
            }

            styles={{
                mask: {
                    background:
                        "rgba(0, 0, 0, 0.65)",
                    backdropFilter:
                        "blur(5px)",

                },

                content: {
                    background: theme.panelSolid,
                    border: `1px solid ${theme.border}`,
                    boxShadow: theme.shadow,
                    padding: "0",
                    borderRadius: "50px",
                },

                header: {
                    background:
                        "transparent",
                    borderBottom:
                        `0px solid ${theme.border}`,
                    padding:
                        "20px 24px 16px",
                    marginBottom: 0,
                },

                body: {
                    background:
                        theme.panelSolid,
                    padding:
                        "20px 24px 24px",


                },
            }}
        >
            <div className="flex flex-col gap-4 ">

                {/* Error */}
                {error && (
                    <div
                        className="rounded-sm px-3 py-2.5 text-xs"
                        style={{
                            color:
                                theme.accent,
                            background:
                                theme.accentSoft,
                            border:
                                `1px solid ${theme.border}`,
                            fontFamily: sans,
                        }}
                    >
                        {error}
                    </div>
                )}


                {/* Title */}
                <Field
                    label="Title"
                    theme={theme}
                >
                    <input
                        value={form.title}
                        onChange={update("title")}
                        placeholder="e.g. Interstellar"
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>


                {/* Description */}
                <Field
                    label="Description"
                    theme={theme}
                >
                    <textarea
                        value={form.description}
                        onChange={update(
                            "description"
                        )}
                        rows={3}
                        placeholder="Short synopsis..."
                        className={`${inputClass} resize-none`}
                        style={inputStyle}
                    />
                </Field>


                {/* Genre + Release Date */}
                <div className="grid grid-cols-2 gap-4">

                    <Field
                        label="Genre"
                        theme={theme}
                    >
                        <input
                            value={form.genre}
                            onChange={update(
                                "genre"
                            )}
                            placeholder="e.g. SCI_FI"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </Field>


                    <Field
                        label="Release Date"
                        theme={theme}
                    >
                        <input
                            type="date"
                            value={
                                form.releaseDate
                            }
                            onChange={update(
                                "releaseDate"
                            )}
                            className={inputClass}
                            style={inputStyle}
                        />
                    </Field>

                </div>


                {/* Rating + Length */}
                <div className="grid grid-cols-2 gap-4">

                    <Field
                        label="IMDB Rating"
                        theme={theme}
                    >
                        <input
                            type="number"
                            min={0}
                            max={10}
                            step={0.1}
                            value={
                                form.imdbRating
                            }
                            onChange={update(
                                "imdbRating"
                            )}
                            placeholder="0.0 – 10.0"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </Field>


                    <Field
                        label="Length (minutes)"
                        theme={theme}
                    >
                        <input
                            type="number"
                            min={0}
                            value={
                                form.length
                            }
                            onChange={update(
                                "length"
                            )}
                            placeholder="e.g. 169"
                            className={inputClass}
                            style={inputStyle}
                        />
                    </Field>

                </div>


                {/* Poster URL */}
                <Field
                    label="Poster URL"
                    theme={theme}
                >
                    <input
                        value={
                            form.posterUrl
                        }
                        onChange={update(
                            "posterUrl"
                        )}
                        placeholder="https://..."
                        className={inputClass}
                        style={inputStyle}
                    />
                </Field>


                {/* Actions */}
                <div
                    className="flex justify-end gap-2 pt-4 mt-1"
                    style={{
                        borderTop:
                            `1px solid ${theme.border}`,
                    }}
                >
                    <Button
                        onClick={onClose}
                        disabled={submitting}
                        style={{
                            height: "38px",
                            padding:
                                "0 18px",
                            background:
                                "transparent",
                            border:
                                `1px solid ${theme.border}`,
                            color:
                                theme.textDim,
                            fontFamily: sans,
                        }}
                    >
                        Cancel
                    </Button>


                    <Button
                        loading={submitting}
                        onClick={
                            handleSubmit
                        }
                        style={{
                            height: "38px",
                            padding:
                                "0 20px",
                            background:
                                theme.accent,
                            border:
                                `1px solid ${theme.accent}`,
                            color:
                                theme.panelSolid,
                            fontFamily: sans,
                        }}
                    >
                        Add Movie
                    </Button>
                </div>

            </div>
        </Modal>
    );
}


// --------------------------------------------------
// Dashboard
// --------------------------------------------------

function Dashboard() {
    const { theme } = useTheme();

    const {
        movies,
        loading,
        error,
        refetch,
    } = useMovies();


    const [isOpen, setIsOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const [genreFilter, setGenreFilter] =
        useState("all");

    const [yearFilter, setYearFilter] =
        useState("all");

    const [sortBy, setSortBy] =
        useState("rating");


    // --------------------------------------------------
    // Genres
    // --------------------------------------------------

    const allGenres = useMemo(() => {
        const set = new Set(
            movies
                .map((movie) => movie.genre)
                .filter(Boolean)
        );

        return [
            "all",
            ...Array.from(set).sort(),
        ];
    }, [movies]);


    // --------------------------------------------------
    // Years
    // --------------------------------------------------

    const allYears = useMemo(() => {
        const set = new Set(
            movies
                .map((movie) => movie.year)
                .filter(Boolean)
        );

        return [
            "all",
            ...Array.from(set).sort(
                (a, b) => b - a
            ),
        ];
    }, [movies]);


    // --------------------------------------------------
    // Filtered Movies
    // --------------------------------------------------

    const filtered = useMemo(() => {
        return movies
            .filter((movie) =>
                movie.title
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            )
            .filter(
                (movie) =>
                    genreFilter === "all" ||
                    movie.genre ===
                    genreFilter
            )
            .filter(
                (movie) =>
                    yearFilter === "all" ||
                    movie.year ===
                    Number(yearFilter)
            )
            .sort((a, b) =>
                sortBy === "rating"
                    ? b.rating - a.rating
                    : b.year - a.year
            );
    }, [
        movies,
        search,
        genreFilter,
        yearFilter,
        sortBy,
    ]);


    // --------------------------------------------------
    // Genre Distribution
    // --------------------------------------------------

    const genreDistribution = useMemo(() => {
        const counts = {};

        filtered.forEach((movie) => {
            counts[movie.genre] =
                (counts[movie.genre] || 0) + 1;
        });

        return Object.entries(counts)
            .map(([name, value]) => ({
                name,
                value,
            }))
            .sort(
                (a, b) =>
                    b.value - a.value
            )
            .slice(0, 8);

    }, [filtered]);


    // --------------------------------------------------
    // Rating By Year
    // --------------------------------------------------

    const ratingsByYear = useMemo(() => {
        const groups = {};

        filtered.forEach((movie) => {
            if (!movie.year) return;

            if (!groups[movie.year]) {
                groups[movie.year] = {
                    year: movie.year,
                    total: 0,
                    count: 0,
                };
            }

            groups[movie.year].total +=
                movie.rating;

            groups[movie.year].count += 1;
        });

        return Object.values(groups)
            .map((group) => ({
                year: group.year,
                avgRating: +(
                    group.total /
                    group.count
                ).toFixed(2),
            }))
            .sort(
                (a, b) =>
                    a.year - b.year
            );

    }, [filtered]);


    // --------------------------------------------------
    // Runtime By Genre
    // --------------------------------------------------

    const runtimeByGenre = useMemo(() => {
        const groups = {};

        filtered.forEach((movie) => {
            if (!movie.length) return;

            if (!groups[movie.genre]) {
                groups[movie.genre] = {
                    genre: movie.genre,
                    total: 0,
                    count: 0,
                };
            }

            groups[movie.genre].total +=
                movie.length;

            groups[movie.genre].count += 1;
        });

        return Object.values(groups)
            .map((group) => ({
                genre: group.genre,
                avgLength: Math.round(
                    group.total /
                    group.count
                ),
            }))
            .sort(
                (a, b) =>
                    b.avgLength -
                    a.avgLength
            );

    }, [filtered]);


    // --------------------------------------------------
    // Average Rating
    // --------------------------------------------------

    const avgRating = useMemo(() => {
        if (!filtered.length) {
            return "0.0";
        }

        return (
            filtered.reduce(
                (sum, movie) =>
                    sum + movie.rating,
                0
            ) / filtered.length
        ).toFixed(1);

    }, [filtered]);


    // --------------------------------------------------
    // Top Rated
    // --------------------------------------------------

    const topRated = useMemo(
        () =>
            [...filtered]
                .sort(
                    (a, b) =>
                        b.rating -
                        a.rating
                )
                .slice(0, 10),
        [filtered]
    );


    // --------------------------------------------------
    // Loading
    // --------------------------------------------------

    if (loading) {
        return (
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    background:
                        "transparent",
                    color:
                        theme.textFaint,
                    fontFamily: serif,
                }}
            >
                Loading movies…
            </div>
        );
    }


    // --------------------------------------------------
    // Error
    // --------------------------------------------------

    if (error) {
        return (
            <div
                className="w-full h-full flex items-center justify-center"
                style={{
                    background:
                        "transparent",
                    color:
                        theme.accent,
                    fontFamily: serif,
                }}
            >
                Couldn't load movies:
                {" "}
                {error}
            </div>
        );
    }


    // --------------------------------------------------
    // Dashboard UI
    // --------------------------------------------------

    return (
        <>
            <div
                className="w-full h-full flex gap-2 overflow-hidden transition-colors duration-500"
                style={{
                    background:
                        "transparent",
                }}
            >

                {/* Image Slider */}
                <div className="w-[30%] h-full">
                    <ImageSlider
                        images={
                            fallbackImages
                        }
                    />
                </div>


                {/* Dashboard Content */}
                <div className="w-[70%] h-full overflow-y-auto scrollbar-hide px-3 space-y-3">

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-4">

                        <StatCard
                            icon={Film}
                            label="Total Movies"
                            value={
                                filtered.length
                            }
                            theme={theme}
                        />

                        <StatCard
                            icon={Star}
                            label="Avg Rating"
                            value={
                                avgRating
                            }
                            theme={theme}
                        />

                        <StatCard
                            icon={TrendingUp}
                            label="Genres"
                            value={
                                allGenres.length -
                                1
                            }
                            theme={theme}
                        />

                        <StatCard
                            icon={Calendar}
                            label="Years Covered"
                            value={
                                allYears.length -
                                1
                            }
                            theme={theme}
                        />

                    </div>


                    {/* Charts Row 1 */}
                    <div className="grid grid-cols-2 gap-4">

                        <ChartCard
                            title="Genre distribution"
                            theme={theme}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="90%"
                            >
                                <PieChart>

                                    <Pie
                                        data={
                                            genreDistribution
                                        }
                                        dataKey="value"
                                        nameKey="name"
                                        outerRadius={70}
                                    >
                                        {genreDistribution.map(
                                            (_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        theme
                                                            .chartPalette[
                                                        i %
                                                        theme
                                                            .chartPalette
                                                            .length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Pie>

                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                theme.panelSolid,
                                            border:
                                                `1px solid ${theme.border}`,
                                            color:
                                                theme.text,
                                        }}
                                    />

                                    <Legend
                                        wrapperStyle={{
                                            fontSize: 11,
                                            color:
                                                theme.textDim,
                                            fontFamily:
                                                sans,
                                        }}
                                    />

                                </PieChart>
                            </ResponsiveContainer>
                        </ChartCard>


                        <ChartCard
                            title="Avg rating by year"
                            theme={theme}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="90%"
                            >
                                <LineChart
                                    data={
                                        ratingsByYear
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            theme.chartGrid
                                        }
                                    />

                                    <XAxis
                                        dataKey="year"
                                        tick={{
                                            fill:
                                                theme.textFaint,
                                            fontSize: 11,
                                        }}
                                    />

                                    <YAxis
                                        domain={[
                                            0,
                                            10,
                                        ]}
                                        tick={{
                                            fill:
                                                theme.textFaint,
                                            fontSize: 11,
                                        }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                theme.panelSolid,
                                            border:
                                                `1px solid ${theme.border}`,
                                            color:
                                                theme.text,
                                        }}
                                    />

                                    <Line
                                        type="monotone"
                                        dataKey="avgRating"
                                        stroke={
                                            theme.accent
                                        }
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </ChartCard>

                    </div>


                    {/* Charts Row 2 */}
                    <div className="grid grid-cols-2 gap-4">

                        <ChartCard
                            title="Avg runtime by genre (min)"
                            theme={theme}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="90%"
                            >
                                <BarChart
                                    data={
                                        runtimeByGenre
                                    }
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            theme.chartGrid
                                        }
                                    />

                                    <XAxis
                                        dataKey="genre"
                                        tick={{
                                            fill:
                                                theme.textFaint,
                                            fontSize: 10,
                                        }}
                                        angle={-20}
                                        textAnchor="end"
                                        height={50}
                                    />

                                    <YAxis
                                        tick={{
                                            fill:
                                                theme.textFaint,
                                            fontSize: 11,
                                        }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                theme.panelSolid,
                                            border:
                                                `1px solid ${theme.border}`,
                                            color:
                                                theme.text,
                                        }}
                                    />

                                    <Bar
                                        dataKey="avgLength"
                                        fill={
                                            theme.accent
                                        }
                                        radius={[
                                            4,
                                            4,
                                            0,
                                            0,
                                        ]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>


                        <ChartCard
                            title="Top 10 rated"
                            theme={theme}
                        >
                            <ResponsiveContainer
                                width="100%"
                                height="90%"
                            >
                                <BarChart
                                    data={
                                        topRated
                                    }
                                    layout="vertical"
                                    margin={{
                                        left: 40,
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke={
                                            theme.chartGrid
                                        }
                                        horizontal={
                                            false
                                        }
                                    />

                                    <XAxis
                                        type="number"
                                        domain={[
                                            0,
                                            10,
                                        ]}
                                        tick={{
                                            fill:
                                                theme.textFaint,
                                            fontSize: 11,
                                        }}
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="title"
                                        width={100}
                                        tick={{
                                            fill:
                                                theme.textDim,
                                            fontSize: 10,
                                        }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            background:
                                                theme.panelSolid,
                                            border:
                                                `1px solid ${theme.border}`,
                                            color:
                                                theme.text,
                                        }}
                                    />

                                    <Bar
                                        dataKey="rating"
                                        radius={[
                                            0,
                                            4,
                                            4,
                                            0,
                                        ]}
                                    >
                                        {topRated.map(
                                            (_, i) => (
                                                <Cell
                                                    key={i}
                                                    fill={
                                                        theme
                                                            .chartPalette[
                                                        i %
                                                        theme
                                                            .chartPalette
                                                            .length
                                                        ]
                                                    }
                                                />
                                            )
                                        )}
                                    </Bar>

                                </BarChart>
                            </ResponsiveContainer>
                        </ChartCard>

                    </div>


                    {/* Filters */}
                    <div
                        className="flex flex-wrap gap-3 items-center rounded-sm p-3"
                        style={{
                            background:
                                theme.panel,
                            border:
                                `1px solid ${theme.border}`,
                            boxShadow:
                                theme.shadow,
                        }}
                    >

                        {/* Search */}
                        <div
                            className="flex items-center gap-2 rounded-sm px-3 py-2 flex-1 min-w-45"
                            style={{
                                background:
                                    theme.inputBg,
                                border:
                                    `1px solid ${theme.border}`,
                            }}
                        >
                            <Search
                                size={16}
                                style={{
                                    color:
                                        theme.textFaint,
                                }}
                            />

                            <input
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target
                                            .value
                                    )
                                }
                                placeholder="Search title..."
                                className="bg-transparent text-sm outline-none w-full"
                                style={{
                                    fontFamily:
                                        sans,
                                    color:
                                        theme.text,
                                }}
                            />
                        </div>


                        {/* Genre */}
                        <select
                            value={genreFilter}
                            onChange={(e) =>
                                setGenreFilter(
                                    e.target.value
                                )
                            }
                            className="text-sm rounded-sm px-3 py-2 outline-none"
                            style={{
                                fontFamily:
                                    sans,
                                background:
                                    theme.inputBg,
                                border:
                                    `1px solid ${theme.border}`,
                                color:
                                    theme.text,
                            }}
                        >
                            {allGenres.map(
                                (genre) => (
                                    <option
                                        key={
                                            genre
                                        }
                                        value={
                                            genre
                                        }
                                    >
                                        {genre ===
                                            "all"
                                            ? "All genres"
                                            : genre}
                                    </option>
                                )
                            )}
                        </select>


                        {/* Year */}
                        <select
                            value={yearFilter}
                            onChange={(e) =>
                                setYearFilter(
                                    e.target.value
                                )
                            }
                            className="text-sm rounded-sm px-3 py-2 outline-none"
                            style={{
                                fontFamily:
                                    sans,
                                background:
                                    theme.inputBg,
                                border:
                                    `1px solid ${theme.border}`,
                                color:
                                    theme.text,
                            }}
                        >
                            {allYears.map(
                                (year) => (
                                    <option
                                        key={
                                            year
                                        }
                                        value={
                                            year
                                        }
                                    >
                                        {year ===
                                            "all"
                                            ? "All years"
                                            : year}
                                    </option>
                                )
                            )}
                        </select>


                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) =>
                                setSortBy(
                                    e.target.value
                                )
                            }
                            className="text-sm rounded-sm px-3 py-2 outline-none"
                            style={{
                                fontFamily:
                                    sans,
                                background:
                                    theme.inputBg,
                                border:
                                    `1px solid ${theme.border}`,
                                color:
                                    theme.text,
                            }}
                        >
                            <option value="rating">
                                Sort by rating
                            </option>

                            <option value="year">
                                Sort by year
                            </option>
                        </select>


                        {/* Add Movie */}
                        <Button
                            onClick={() =>
                                setIsOpen(true)
                            }
                            style={{
                                height: "38px",
                                padding:
                                    "0 18px",
                                background:
                                    theme.accent,
                                border:
                                    `1px solid ${theme.accent}`,
                                color:
                                    theme.panelSolid,
                                fontFamily:
                                    sans,
                            }}
                        >
                            Add Movie
                        </Button>

                    </div>


                    {/* Movie Grid */}
                    <div className="grid grid-cols-5 gap-4">

                        {filtered
                            .slice(0, 20)
                            .map((movie) => (
                                <motion.div
                                    key={
                                        movie.id
                                    }
                                    className="rounded-sm overflow-hidden aspect-4/3 relative group"
                                    style={{
                                        background:
                                            theme.panel,
                                        border:
                                            `1px solid ${theme.border}`,
                                        boxShadow:
                                            theme.shadow,
                                    }}
                                    whileHover={{
                                        scale: 1.03,
                                    }}
                                >

                                    {movie.poster ? (
                                        <img
                                            src={
                                                movie.poster
                                            }
                                            alt={
                                                movie.title
                                            }
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div
                                            className="w-full h-full flex items-center justify-center text-xs"
                                            style={{
                                                color:
                                                    theme.textFaint,
                                            }}
                                        >
                                            No image
                                        </div>
                                    )}


                                    <div
                                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2"
                                        style={{
                                            background:
                                                `linear-gradient(180deg, transparent 40%, ${theme.panelSolid} 100%)`,
                                        }}
                                    >
                                        <p
                                            className="text-xs font-medium truncate"
                                            style={{
                                                fontFamily:
                                                    sans,
                                                color:
                                                    theme.text,
                                            }}
                                        >
                                            {
                                                movie.title
                                            }
                                        </p>

                                        <p
                                            className="text-[10px]"
                                            style={{
                                                color:
                                                    theme.accent,
                                            }}
                                        >
                                            ★{" "}
                                            {
                                                movie.rating
                                            }
                                        </p>
                                    </div>

                                </motion.div>
                            ))}

                    </div>

                </div>
            </div>


            {/* Add Movie Modal */}
            <AddMovieModal
                open={isOpen}
                onClose={() =>
                    setIsOpen(false)
                }
                onAdded={refetch}
                theme={theme}
            />
        </>
    );
}

export default Dashboard;
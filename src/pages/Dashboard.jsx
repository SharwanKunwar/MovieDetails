import { useState, useEffect, useMemo } from "react"
import { motion } from "motion/react"
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts"
import { Search, TrendingUp, Star, Film, Calendar } from "lucide-react"
import ImageSlider from "../components/ImageSlider"
import { useTheme } from "../theme/ThemeContext"
import { serif, sans } from "../theme/Themes"

const API_URL = "http://localhost:8080/api/movies/all"

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

// --- Normalization: matches Movie entity exactly ---
function normalizeMovie(raw) {
    return {
        id: raw.id,
        title: raw.title,
        description: raw.description ?? "",
        genre: raw.genre ?? "UNKNOWN",
        releaseDate: raw.releaseDate ?? null,
        year: raw.releaseDate ? new Date(raw.releaseDate).getFullYear() : 0,
        rating: raw.imdbRating ?? 0,
        length: raw.length ?? 0,
        poster: raw.posterUrl ?? null,
        deleted: raw.deleted ?? false,
    }
}

function useMovies() {
    const [movies, setMovies] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        let cancelled = false
        setLoading(true)
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`API responded ${res.status}`)
                return res.json()
            })
            .then((data) => {
                if (cancelled) return
                const list = Array.isArray(data) ? data : data.movies ?? data.data ?? data.content ?? []
                setMovies(list.map(normalizeMovie).filter((m) => !m.deleted))
            })
            .catch((err) => !cancelled && setError(err.message))
            .finally(() => !cancelled && setLoading(false))
        return () => { cancelled = true }
    }, [])

    return { movies, loading, error }
}

function StatCard({ icon: Icon, label, value, theme }) {
    return (
        <div
            className="rounded-sm p-4 flex items-center gap-3 transition-colors duration-500"
            style={{ background: theme.panel, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
        >
            <div className="p-2 rounded-sm" style={{ background: theme.accentSoft, color: theme.accent }}>
                <Icon size={18} strokeWidth={1.5} />
            </div>
            <div>
                <p className="text-xs uppercase tracking-wide" style={{ fontFamily: sans, color: theme.textFaint }}>{label}</p>
                <p className="text-lg" style={{ fontFamily: serif, color: theme.text }}>{value}</p>
            </div>
        </div>
    )
}

function ChartCard({ title, theme, children }) {
    return (
        <div
            className="rounded-sm p-4 h-64 transition-colors duration-500"
            style={{ background: theme.panel, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
        >
            <p className="text-sm mb-2" style={{ fontFamily: sans, color: theme.textDim }}>{title}</p>
            {children}
        </div>
    )
}

function Dashboard() {
    const { theme } = useTheme()
    const { movies, loading, error } = useMovies()

    const [search, setSearch] = useState("")
    const [genreFilter, setGenreFilter] = useState("all")
    const [yearFilter, setYearFilter] = useState("all")
    const [sortBy, setSortBy] = useState("rating")

    const allGenres = useMemo(() => {
        const set = new Set(movies.map((m) => m.genre).filter(Boolean))
        return ["all", ...Array.from(set).sort()]
    }, [movies])

    const allYears = useMemo(() => {
        const set = new Set(movies.map((m) => m.year).filter(Boolean))
        return ["all", ...Array.from(set).sort((a, b) => b - a)]
    }, [movies])

    const filtered = useMemo(() => {
        return movies
            .filter((m) => m.title.toLowerCase().includes(search.toLowerCase()))
            .filter((m) => genreFilter === "all" || m.genre === genreFilter)
            .filter((m) => yearFilter === "all" || m.year === Number(yearFilter))
            .sort((a, b) => (sortBy === "rating" ? b.rating - a.rating : b.year - a.year))
    }, [movies, search, genreFilter, yearFilter, sortBy])

    const genreDistribution = useMemo(() => {
        const counts = {}
        filtered.forEach((m) => { counts[m.genre] = (counts[m.genre] || 0) + 1 })
        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8)
    }, [filtered])

    const ratingsByYear = useMemo(() => {
        const groups = {}
        filtered.forEach((m) => {
            if (!m.year) return
            if (!groups[m.year]) groups[m.year] = { year: m.year, total: 0, count: 0 }
            groups[m.year].total += m.rating
            groups[m.year].count += 1
        })
        return Object.values(groups)
            .map((g) => ({ year: g.year, avgRating: +(g.total / g.count).toFixed(2) }))
            .sort((a, b) => a.year - b.year)
    }, [filtered])

    const runtimeByGenre = useMemo(() => {
        const groups = {}
        filtered.forEach((m) => {
            if (!m.length) return
            if (!groups[m.genre]) groups[m.genre] = { genre: m.genre, total: 0, count: 0 }
            groups[m.genre].total += m.length
            groups[m.genre].count += 1
        })
        return Object.values(groups)
            .map((g) => ({ genre: g.genre, avgLength: Math.round(g.total / g.count) }))
            .sort((a, b) => b.avgLength - a.avgLength)
    }, [filtered])

    const avgRating = useMemo(() => {
        if (!filtered.length) return "0.0"
        return (filtered.reduce((sum, m) => sum + m.rating, 0) / filtered.length).toFixed(1)
    }, [filtered])

    const topRated = useMemo(
        () => [...filtered].sort((a, b) => b.rating - a.rating).slice(0, 10),
        [filtered]
    )

    if (loading) {
        return (
            <div className="w-full h-full flex items-center justify-center transition-colors duration-500" style={{ background: "transparent", color: theme.textFaint, fontFamily: serif }}>
                Loading movies…
            </div>
        )
    }

    if (error) {
        return (
            <div className="w-full h-full flex items-center justify-center transition-colors duration-500" style={{ background: "transparent", color: theme.accent, fontFamily: serif }}>
                Couldn't load movies: {error}
            </div>
        )
    }

    return (
        <div className="w-full h-full flex gap-5 overflow-hidden transition-colors duration-500" style={{ background: "transparent" }}>
            {/* left: poster slider */}
            <div className="w-[25%] h-full transition-colors duration-500">
                <ImageSlider images={fallbackImages} />
            </div>

            {/* right: dashboard */}
            <div className="w-[75%] h-full overflow-y-auto scrollbar-hide p-6 space-y-6">
                {/* stats row */}
                <div className="grid grid-cols-4 gap-4">
                    <StatCard icon={Film} label="Total Movies" value={filtered.length} theme={theme} />
                    <StatCard icon={Star} label="Avg Rating" value={avgRating} theme={theme} />
                    <StatCard icon={TrendingUp} label="Genres" value={allGenres.length - 1} theme={theme} />
                    <StatCard icon={Calendar} label="Years Covered" value={allYears.length - 1} theme={theme} />
                </div>

                {/* filters */}
                <div
                    className="flex flex-wrap gap-3 items-center rounded-sm p-3 transition-colors duration-500"
                    style={{ background: theme.panel, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
                >
                    <div
                        className="flex items-center gap-2 rounded-sm px-3 py-2 flex-1 min-w-[180px] transition-colors duration-300"
                        style={{ background: theme.inputBg, border: `1px solid ${theme.border}` }}
                    >
                        <Search size={16} style={{ color: theme.textFaint }} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search title…"
                            className="bg-transparent text-sm outline-none w-full"
                            style={{ fontFamily: sans, color: theme.text }}
                        />
                    </div>

                    <select
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="text-sm rounded-sm px-3 py-2 outline-none transition-colors duration-300"
                        style={{ fontFamily: sans, background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text }}
                    >
                        {allGenres.map((g) => <option key={g} value={g}>{g === "all" ? "All genres" : g}</option>)}
                    </select>

                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="text-sm rounded-sm px-3 py-2 outline-none transition-colors duration-300"
                        style={{ fontFamily: sans, background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text }}
                    >
                        {allYears.map((y) => <option key={y} value={y}>{y === "all" ? "All years" : y}</option>)}
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm rounded-sm px-3 py-2 outline-none transition-colors duration-300"
                        style={{ fontFamily: sans, background: theme.inputBg, border: `1px solid ${theme.border}`, color: theme.text }}
                    >
                        <option value="rating">Sort by rating</option>
                        <option value="year">Sort by year</option>
                    </select>
                </div>

                {/* charts row 1 */}
                <div className="grid grid-cols-2 gap-4">
                    <ChartCard title="Genre distribution" theme={theme}>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie data={genreDistribution} dataKey="value" nameKey="name" outerRadius={70}>
                                    {genreDistribution.map((_, i) => (
                                        <Cell key={i} fill={theme.chartPalette[i % theme.chartPalette.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, color: theme.text }} />
                                <Legend wrapperStyle={{ fontSize: 11, color: theme.textDim, fontFamily: sans }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Avg rating by year" theme={theme}>
                        <ResponsiveContainer width="100%" height="90%">
                            <LineChart data={ratingsByYear}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                                <XAxis dataKey="year" tick={{ fill: theme.textFaint, fontSize: 11 }} />
                                <YAxis domain={[0, 10]} tick={{ fill: theme.textFaint, fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, color: theme.text }} />
                                <Line type="monotone" dataKey="avgRating" stroke={theme.accent} strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* charts row 2 */}
                <div className="grid grid-cols-2 gap-4">
                    <ChartCard title="Avg runtime by genre (min)" theme={theme}>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={runtimeByGenre}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} />
                                <XAxis dataKey="genre" tick={{ fill: theme.textFaint, fontSize: 10 }} angle={-20} textAnchor="end" height={50} />
                                <YAxis tick={{ fill: theme.textFaint, fontSize: 11 }} />
                                <Tooltip contentStyle={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, color: theme.text }} />
                                <Bar dataKey="avgLength" fill={theme.accent} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Top 10 rated" theme={theme}>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart data={topRated} layout="vertical" margin={{ left: 40 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={theme.chartGrid} horizontal={false} />
                                <XAxis type="number" domain={[0, 10]} tick={{ fill: theme.textFaint, fontSize: 11 }} />
                                <YAxis
                                    type="category"
                                    dataKey="title"
                                    width={100}
                                    tick={{ fill: theme.textDim, fontSize: 10 }}
                                />
                                <Tooltip contentStyle={{ background: theme.panelSolid, border: `1px solid ${theme.border}`, color: theme.text }} />
                                <Bar dataKey="rating" radius={[0, 4, 4, 0]}>
                                    {topRated.map((_, i) => <Cell key={i} fill={theme.chartPalette[i % theme.chartPalette.length]} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                {/* filtered movie grid */}
                <div className="grid grid-cols-5 gap-4">
                    {filtered.slice(0, 20).map((m) => (
                        <motion.div
                            key={m.id}
                            className="rounded-sm overflow-hidden aspect-4/3 relative group transition-colors duration-500"
                            style={{ background: theme.panel, border: `1px solid ${theme.border}`, boxShadow: theme.shadow }}
                            whileHover={{ scale: 1.03 }}
                        >
                            {m.poster
                                ? <img src={m.poster} alt={m.title} className="w-full h-full object-cover" />
                                : <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: theme.textFaint }}>No image</div>}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2"
                                style={{ background: `linear-gradient(180deg, transparent 40%, ${theme.panelSolid} 100%)` }}
                            >
                                <p className="text-xs font-medium truncate" style={{ fontFamily: sans, color: theme.text }}>{m.title}</p>
                                <p className="text-[10px]" style={{ color: theme.accent }}>★ {m.rating}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
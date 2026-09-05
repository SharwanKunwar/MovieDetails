import { motion } from "motion/react";
import {
    ArrowRight,
    Film,
    Star,
    Tags,
    CalendarDays,
} from "lucide-react";
import { Link } from "react-router-dom";

import ImageSlider from "../components/ImageSlider";
import { useTheme } from "../theme/ThemeContext";
import { serif, sans } from "../theme/Themes";

const fallbackImages = [
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
];

function HomePage() {
    const { theme } = useTheme();

    const stats = [
        {
            label: "Movies",
            value: "100+",
            icon: Film,
        },
        {
            label: "Average Rating",
            value: "8.2",
            icon: Star,
        },
        {
            label: "Genres",
            value: "12+",
            icon: Tags,
        },
        {
            label: "Years Covered",
            value: "40+",
            icon: CalendarDays,
        },
    ];

    return (
        <div
            className="w-full h-full flex gap-5 overflow-hidden"
            style={{ color: theme.text }}
        >
            {/* LEFT SECTION */}
            <div
                className="w-[70%] h-full flex flex-col justify-between px-14 py-12 rounded-sm"
                style={{
                    background: theme.panel,
                    border: `1px solid ${theme.border}`,
                }}
            >
                {/* Intro */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.7 }}
                    className="max-w-2xl"
                >
                    <p
                        className="text-xs uppercase tracking-[0.3em] mb-5"
                        style={{
                            fontFamily: sans,
                            color: theme.accent,
                        }}
                    >
                        Welcome to MovieDetails
                    </p>

                    <h1
                        className="text-6xl leading-[0.9] tracking-tight"
                        style={{ fontFamily: serif }}
                    >
                        Every movie
                        <br />
                        has a{" "}
                        <span
                            className="italic"
                            style={{ color: theme.accent }}
                        >
                            story.
                        </span>
                    </h1>

                    <p
                        className="mt-7 text-sm leading-6 max-w-lg"
                        style={{
                            fontFamily: sans,
                            color: theme.textDim,
                        }}
                    >
                        MovieDetails is a place to discover, explore, and
                        learn more about the movies you love. Browse through
                        films, explore their genres, check ratings, release
                        dates, runtimes, and discover something worth watching.
                    </p>

                    <Link
                        to="/action"
                        className="inline-flex items-center gap-3 mt-8 px-6 py-3 rounded-sm text-sm transition-all duration-300 hover:scale-105"
                        style={{
                            background: theme.accent,
                            color: theme.panelSolid,
                            fontFamily: sans,
                        }}
                    >
                        Explore Movies
                        <ArrowRight size={15} />
                    </Link>
                </motion.div>

                {/* PURPOSE */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className="mb-8"
                >
                    <p
                        className="text-xs uppercase tracking-[0.2em] mb-4"
                        style={{
                            fontFamily: sans,
                            color: theme.textFaint,
                        }}
                    >
                        What you can discover
                    </p>

                    <div className="grid grid-cols-4 gap-3">
                        {stats.map((stat, index) => {
                            const Icon = stat.icon;

                            return (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: 0.45 + index * 0.1,
                                        duration: 0.5,
                                    }}
                                    className="p-4 rounded-sm transition-all duration-300 hover:-translate-y-1"
                                    style={{
                                        background: theme.inputBg,
                                        border: `1px solid ${theme.border}`,
                                    }}
                                >
                                    <div className="flex items-center justify-between mb-5">
                                        <Icon
                                            size={17}
                                            style={{
                                                color: theme.accent,
                                            }}
                                        />

                                        {stat.label === "Average Rating" && (
                                            <Star
                                                size={12}
                                                fill="currentColor"
                                                style={{
                                                    color: theme.accent,
                                                }}
                                            />
                                        )}
                                    </div>

                                    <p
                                        className="text-2xl"
                                        style={{
                                            fontFamily: serif,
                                        }}
                                    >
                                        {stat.value}
                                    </p>

                                    <p
                                        className="text-[11px] mt-1"
                                        style={{
                                            fontFamily: sans,
                                            color: theme.textDim,
                                        }}
                                    >
                                        {stat.label}
                                    </p>
                                </motion.div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* RIGHT SECTION */}
            <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="w-[30%] h-full overflow-hidden rounded-sm"
            >
                <ImageSlider images={fallbackImages} />
            </motion.div>
        </div>
    );
}

export default HomePage;
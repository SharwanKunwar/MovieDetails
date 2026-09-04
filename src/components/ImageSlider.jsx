
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Scrollbar,
    Autoplay,
    A11y,
    EffectFade,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-fade";

/**
 * ImageSlider
 * A reusable fade-autoplay Swiper carousel, extracted from IntroductionPage.
 *
 * Usage:
 *   <ImageSlider images={images} />
 *   <ImageSlider images={images} autoplayDelay={4000} effect="slide" />
 */
function ImageSlider({
    images = [],
    className = "",
    wrapperClassName = "",
    autoplayDelay = 3000,
    loop = true,
    effect = "fade",
    slidesPerView = 1,
    pagination = true,
    scrollbar = true,
    navigation = false,
    disableOnInteraction = false,
}) {
    if (!images.length) return null;

    return (
        <div className={wrapperClassName} className="w-full h-full">
            <Swiper
                className={`w-full h-full transition-all border rounded-md border-white/30 shadow-sm ${className}`}
                modules={[Navigation, Autoplay, Pagination, Scrollbar, A11y, EffectFade]}
                slidesPerView={slidesPerView}
                effect={effect}
                loop={loop}
                navigation={navigation}
                pagination={pagination ? { clickable: true } : false}
                scrollbar={scrollbar ? { draggable: true } : false}
                autoplay={{ delay: autoplayDelay, disableOnInteraction }}
            >
                {images.map((item, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={item}
                            alt={`slide-${index}`}
                            className="w-full h-full object-cover rounded-md"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default ImageSlider;
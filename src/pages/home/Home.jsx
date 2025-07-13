import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./Home.css"
import React, { useState } from 'react';
import phoneBackground from '../../assets/images/iphone.webp';
import watchBackground from '../../assets/images/watch.webp';
import Product from "../../components/product/Product";
import Category from "../../components/category/Categories";
import Categories from "../../components/category/Categories";
import Marquee from "../../components/marquee/Marquee";

const slidesData = [
  {
    src: watchBackground,
    alt: 'Smartwatch',
    titleParts: [
      { text: "Wear the future"},
      { text: "on your wrist"} 
    ],
    subtitle: 'More than a watch — it\'s your daily companion',
    buttonText: 'Explore Now',
  },
  {
    src: phoneBackground,
    alt: 'iPhone 16',
    titleParts: [
      { 
        text: "iPhone 16 covers", 
        parts: [
          { text: "Iphone 16 ", color: "linear-gradient(#e15a2d, #e76d20,#f18c07)" }, 
          { text: " covers", color: "#ffffff" }
        ]
      },
      { 
        text: "all your needs", 
        color: "#ffffff" 
      }
    ],
    subtitle: 'Experience speed, power, and innovation in your hands.',
    buttonText: 'Explore Now',
  },
];

export default () => {
  const [opacities, setOpacities] = useState([])
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    slides: slidesData.length,
    loop: true,
    detailsChanged(s) {
      const new_opacities = s.track.details.slides.map((slide) => slide.portion)
      setOpacities(new_opacities)
      setCurrentSlide(s.track.details.rel);
    },
    dragSpeed: 0.7,
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (instanceRef.current) {
        instanceRef.current.next();
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [instanceRef]);

  return (
    <>
      <div className="home-container">
        <div ref={sliderRef} className="fader">
          {slidesData.map((slide, idx) => (
            <div
              key={idx}
              className={`fader__slide ${currentSlide === idx ? 'active' : ''}`}
              style={{ opacity: opacities[idx] }}
            >
              <div className="slide-background-container">
                <img src={slide.src} alt={slide.alt} className="slide-background-image" />
              </div>
              <div className="slide-content">
                <h1 className="slide-title">
                  {slide.titleParts.map((part, index) => (
                    <React.Fragment key={index}>
                      {part.parts ? (
                        <span style={{ 
                          opacity: currentSlide === idx ? 1 : 0,
                          transform: currentSlide === idx ? 'translateY(0)' : 'translateY(20px)',
                          transition: `all 0.8s ease ${0.3 + index * 0.2}s`
                        }}>
                          {part.parts.map((subPart, subIndex) => (
                            <React.Fragment key={subIndex}>
                              <span 
                                style={{
                                  background: subPart.color?.includes('linear-gradient') ? subPart.color : undefined,
                                  WebkitBackgroundClip: subPart.color?.includes('linear-gradient') ? 'text' : undefined,
                                  WebkitTextFillColor: subPart.color?.includes('linear-gradient') ? 'transparent' : subPart.color,
                                  color: subPart.color?.includes('linear-gradient') ? undefined : subPart.color,
                                  display: 'inline-block'
                                }}
                              >
                                {subPart.text}
                              </span>   
                              {subIndex < part.parts.length - 1 && <span>&nbsp;</span>}
                            </React.Fragment>
                          ))}
                        </span>
                      ) : (
                        <span 
                          style={{ 
                            color: part.color,
                            opacity: currentSlide === idx ? 1 : 0,
                            transform: currentSlide === idx ? 'translateY(0)' : 'translateY(20px)',
                            transition: `all 0.8s ease ${0.3 + index * 0.2}s`
                          }}
                        >
                          {part.text}
                        </span>
                      )}
                      {index < slide.titleParts.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </h1>
                <p className="slide-subtitle">{slide.subtitle}</p>
                <button className="slide-button">{slide.buttonText}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="dots">
          {slidesData.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={'dot' + (currentSlide === idx ? ' active' : '')}
            ></button>
          ))}
        </div>
      </div>
      <Product/>
      <Marquee />
      <Categories/>
    </>
  )
}
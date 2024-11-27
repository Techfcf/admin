import { FC, MouseEvent } from 'react';
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import school1 from '/assets/school1.png'
import school2 from '/assets/school2.png'
import school3 from '/assets/school3.png'

const Home = () => {
  interface ArrowProps {
    onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  }

  const PrevArrow: FC<ArrowProps> = ({ onClick }) => {
    return (
      <button className="slick-arrow slick-prev" onClick={onClick} />
    );
  };

  const NextArrow: FC<ArrowProps> = ({ onClick }) => {
    return (
      <button className="slick-arrow slick-next" onClick={onClick} />
    );
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000, // Adjust the speed (in milliseconds) as needed
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
  };

  const slides = [
    {
      image: school1,
      text: 'First Image',
    },
    {
      image: school2,
      text: 'Second Image',
    },
    {
      image: school3,
      text: 'Third Image',
    },
  ];

  return (
    <div className="home">
      <div className="slider-container">
        <Slider {...sliderSettings}>
          {slides.map((slide, index) => (
            <div key={index} className="slide">
              <img src={slide.image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default Home


import React from "react";
import Slider from "react-slick";
import ava01 from "../../../assets/images/ava-1.jpg";
import ava02 from "../../../assets/images/ava-2.jpg";
import ava03 from "../../../assets/images/ava-3.jpg";
import ava04 from "../../../assets/images/ava-4.jpg";
import "../../../styles/slider.css";

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    autoPlay: true,
    infinite: true,
    speed: 1000,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      <div>
        <p className="review__text">
          "I'm constantly amazed by the efficiency and speed of Foodie. The quality of the food combined with their prompt
          service keeps me coming back for more!"
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <img src={ava01} alt="avatar" className=" rounded" />
          <h6>John Doe</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "Customer support at Foodie is top-notch! They
          go above and beyond to ensure a smooth ordering process. It's
          refreshing to see a company that truly values its customers."
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <img src={ava02} alt="avatar" className="rounded" />
          <h6>Steven Crock</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "The variety of cuisines available is fantastic! I can order from my
          favorite restaurants with ease, and the delivery is always on time.
          Foodie has become my go-to for delicious meals."
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <img src={ava03} alt="avatar" className=" rounded" />
          <h6>Missi Lou</h6>
        </div>
      </div>
      <div>
        <p className="review__text">
          "The convenience of being able to order from any location is a
          game-changer. Whether I'm at home or work, I know I can count on Foodie to satisfy my cravings."
        </p>
        <div className="slider__content d-flex align-items-center gap-3">
          <img src={ava04} alt="avatar" className=" rounded" />
          <h6>Karen Doe</h6>
        </div>
      </div>
    </Slider>
  );
};

export default TestimonialSlider;

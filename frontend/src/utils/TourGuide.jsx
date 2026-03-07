

import React, { useEffect, useState } from "react";
import Joyride from "react-joyride";

const TourGuide = () => {
  const [run, setRun] = useState(false);

  const steps = [
    {
      target: ".login-button-guide",
      content: "Click here to login or sign up to get started!",
    },
    {
      target: ".nearby-shops",
      content: "Find shops near your location by clicking here!",
    },
    {
      target: ".explore-shop-list",
      content: "Select your shop from the list for getting selected shop food.",
    },
    {
      target: ".food-item-card-container",
      content: "view the food profile or Add your favorite items to the cart from here.",
    }
  ];

  useEffect(() => {
    const isFirstVisit = localStorage.getItem("isFirstVisitTomato");
    const isLoggedIn = localStorage.getItem("token"); 

    if (!isFirstVisit || !isLoggedIn) {
      setRun(true);
      localStorage.setItem("isFirstVisitTomato", "false");
    }
  }, []);

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: 'tomato',
        },
      }}
    />
  );
};

export default TourGuide;

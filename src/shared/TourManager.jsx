import { useEffect } from "react";
import Shepherd from "shepherd.js";
import { useNavigate } from "react-router-dom";
import "shepherd.js/dist/css/shepherd.css";

const TourManager = ({ steps = [], pageKey }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem(`tour_${pageKey}_done`) === "true") return;

    if (window.__tour__) {
      window.__tour__.cancel();
      window.__tour__ = null;
    }

    const tour = new Shepherd.Tour({
  useModalOverlay: true, // ✅ Enables overlay
  defaultStepOptions: {
    cancelIcon: { enabled: true },
    classes: "shadow-md bg-purple-200",
    scrollTo: { behavior: "smooth", block: "center" },
  },
});

    const resetTour = () => {
      for (let i = 1; i <= 9; i++) {
        localStorage.removeItem(`tour_page${i}_done`);
      }
      navigate("/employee-dashboard");
    };
    steps.forEach(({ nextRoute, ...step }) => {
      tour.addStep({
        ...step,
        buttons: [
          {
            text: "Skip",
            action: () => {
              for (let i = 1; i <= 9; i++) {
                localStorage.setItem(`tour_page${i}_done`, "true");
              }

              tour.cancel();
            },
          },
          {
            text: "Next",
            action: () => {
              localStorage.setItem(`tour_${pageKey}_done`, "true");
              tour.complete();
              if (nextRoute) navigate(nextRoute);
            },
          },
        ],
      });
    });

    window.__tour__ = tour;
    tour.start();

    return () => {
      tour.cancel();
    };
  }, [steps, navigate, pageKey]);

  return null;
};

export default TourManager;

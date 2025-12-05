"use client";

import { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "@/pages/test/shepherd-custom.scss";
import { usePage } from "@inertiajs/react";




const GuideTour = () => {
    const { url } = usePage();
    const tourRef = useRef<Shepherd.Tour | null>(null);

    useEffect(() => {
        const tour = new Shepherd.Tour({
            useModalOverlay: true,
            defaultStepOptions: {
                // UI/UX Improvement: Enable the close icon for easy exit
                // cancelIcon: { enabled: true },
                classes: "shepherd-theme-custom",
                scrollTo: { behavior: "smooth", block: "center" },
                arrow: false, // You may enable this if you need the arrow
            },
        });

        tourRef.current = tour;

        // --- Dashboard steps ---
        if (url === "/dashboard") {
            tour.addStep({
                id: "d1",
                title: "Welcome to the Dashboard!",
                text: "This tour will show you the key areas of the dashboard. Click 'Start tour' to begin, or press F1 anytime to open and esc to exit.",
                attachTo: { element: ".dashboard-title", on: "bottom" },
                buttons: [
                    {
                        text: "Start tour",
                        action: tour.next,
                    },
                ],
            });

            tour.addStep({
                id: "d2",
                title: "Stats Overview",
                text: "Your current performance metrics are summarized here. Keep an eye on these key indicators!",
                attachTo: { element: "#stats-card", on: "right" },
                buttons: [
                    {
                        text: "Next",
                        action: tour.next,
                    },
                ],
            });

              tour.addStep({
                id: "d3",
                title: "Document Acitivty Trend",
                text: "A line graph timeline where you can track the frequency of document uploads.",
                attachTo: { element: "#stats-card-left", on: "right" },
                buttons: [
                    {
                       text: "Next",
                        action: tour.next,
                    },
                ],
            });

               tour.addStep({
                id: "d4",
                title: "Document Acitivty Trend",
                text: "A line graph timeline where you can track the frequency of document uploads.",
                attachTo: { element: "#stats-card-center", on: "right" },
                buttons: [
                    {
                       text: "Next",
                        action: tour.next,
                    },
                ],
            });

               tour.addStep({
                id: "d5",
                title: "Document Acitivty Trend",
                text: "A line graph timeline where you can track the frequency of document uploads.",
                attachTo: { element: "#stats-card-right", on: "right" },
                buttons: [
                    {
                       text: "Next",
                        action: tour.next,
                    },
                ],
            });

               tour.addStep({
                id: "d6",
                title: "Document Acitivty Trend",
                text: "A line graph timeline where you can track the frequency of document uploads.",
                attachTo: { element: "#stat-table", on: "right" },
                buttons: [
                    {
                       text: "Finish",
                        action: tour.complete,
                    },
                ],
            });
        }

        // --- Programs page steps ---
        if (url === "/users") {
            tour.addStep({
                id: "p1",
                title: "Welcome to User Management Page!",
                text: "This page will handle the account creations of users within the system",
                attachTo: { element: "", on: "bottom" },
                buttons: [
                    {
                        text: "Next",
                        action: tour.next,
                    },
                ],
            });

            tour.addStep({
                id: "p2",
                title: "Create Program",
                text: "Click this button to quickly add a new program and define its core parameters.",
                attachTo: { element: "#user-table", on: "bottom" },
                buttons: [
                    {
                        text: "Finish",
                        action: tour.complete,
                    },
                ],
            });
        }

        // --- F1 keyboard activation ---
        const handleKey = (e: KeyboardEvent) => {
            // Note: The key is "F1" (case-sensitive for e.key)
            if (e.key === "F1") {
                e.preventDefault();
                // Only start if the tour is not already active
                if (!tour.isActive()) tour.start();
            }
        };

        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [url]);

    return null; // no extra button needed; F1 triggers it
};

export default GuideTour;
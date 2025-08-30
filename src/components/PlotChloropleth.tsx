"use client";
import { useEffect, useRef } from "react";
import * as Plot from "@observablehq/plot";

export default function PlotChoropleth() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    // Example GeoJSON data
    const geoData = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Region A", value: 10 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-100, 40],
                [-90, 40],
                [-90, 50],
                [-100, 50],
                [-100, 40],
              ],
            ],
          },
        },
        {
          type: "Feature",
          properties: { name: "Region B", value: 20 },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [-90, 40],
                [-80, 40],
                [-80, 50],
                [-90, 50],
                [-90, 40],
              ],
            ],
          },
        },
      ],
    };

    // Create the choropleth plot
    const chart = Plot.plot({
      projection: "mercator",
      marks: [
        Plot.geo(geoData, {
          fill: (d) => d.properties.value,
          stroke: "black",
          title: (d) => `${d.properties.name}: ${d.properties.value}`,
        }),
      ],
    });

    // Append the chart to the container
    container.appendChild(chart);

    // Cleanup on unmount
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={ref}></div>;
}

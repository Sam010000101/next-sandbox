"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Visualization() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    // Create the SVG container
    const svg = d3
      .select(container)
      .append("svg")
      .attr("class", "plot")
      .attr("fill", "currentColor")
      .attr("font-family", "system-ui, sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "middle")
      .attr("width", 300)
      .attr("height", 300)
      .attr("viewBox", "0 0 688 1146");

    // Add example circles and paths (simplified for demonstration)
    svg
      .append("circle")
      .attr("cx", 100)
      .attr("cy", 100)
      .attr("r", 50)
      .attr("fill", "steelblue");

    svg
      .append("path")
      .attr("d", "M0,0 L100,100")
      .attr("stroke", "black")
      .attr("stroke-width", 2);

    // Cleanup on unmount
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={ref}></div>;
}

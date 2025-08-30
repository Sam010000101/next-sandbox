"use client";
import { useEffect, useRef } from "react";
import * as d3 from "d3";

export default function D3Example() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    // Example: Create a simple bar chart
    const data = [80, 120, 60, 150, 200];

    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", 400)
      .attr("height", 200);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * 80)
      .attr("y", (d) => 200 - d)
      .attr("width", 50)
      .attr("height", (d) => d)
      .attr("fill", "steelblue");

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (d, i) => i * 80 + 25)
      .attr("y", (d) => 200 - d - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "black");

    // Cleanup on unmount
    return () => {
      container.innerHTML = "";
    };
  }, []);

  return <div ref={ref}></div>;
}

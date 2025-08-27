"use client";

import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import features from "../data/features.json";

const geoUrl = features;

export default function MapChart() {
  return (
    <ComposableMap>
      <Geographies className="fill-green-400" geography={geoUrl}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
    </ComposableMap>
  );
}

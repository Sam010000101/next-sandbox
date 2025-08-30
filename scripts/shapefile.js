import fs from "fs";
import { exec } from "child_process";
import shapefile from "shapefile";

const geojsonPath = "../public/geometry-collection.json";
const topojsonPath = "../public/geometry-collection.topojson";
const simplifiedTopojsonPath =
  "../public/geometry-collection-simplified.topojson";

// Start the JSON file with an opening array bracket
fs.writeFileSync(geojsonPath, "[");

shapefile
  .open(
    "../public/Local_Authority_Districts_(May_2025)_Boundaries_UK_BFC_(V2).shp",
    "../public/Local_Authority_Districts_(May_2025)_Boundaries_UK_BFC_(V2).dbf"
  )
  .then((source) =>
    source.read().then(function log(result) {
      if (result.done) {
        // Close the JSON array
        fs.appendFileSync(geojsonPath, "]");
        console.log(`GeoJSON written to ${geojsonPath}`);

        // Convert GeoJSON to TopoJSON
        exec(
          `geo2topo -o ${topojsonPath} ${geojsonPath}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(`Error converting to TopoJSON: ${error.message}`);
              console.error(`stderr: ${stderr}`);
              return;
            }
            console.log(`TopoJSON written to ${topojsonPath}`);
            console.log(`stdout: ${stdout}`);

            // Simplify the TopoJSON immediately after generating it
            exec(
              `toposimplify -o ${simplifiedTopojsonPath} --simplify-proportion 0.05 ${topojsonPath}`,
              (error, stdout, stderr) => {
                if (error) {
                  console.error(`Error simplifying TopoJSON: ${error.message}`);
                  console.error(`stderr: ${stderr}`);
                  return;
                }
                console.log(
                  `Simplified TopoJSON written to ${simplifiedTopojsonPath}`
                );
                console.log(`stdout: ${stdout}`);
              }
            );
          }
        );

        return;
      }
      const { geometry, properties } = result.value;
      const id = properties.FID; // Use FID or another unique identifier as the ID
      const name = properties.LAD25NM; // Use LAD25NM or another property for the name

      // Simplify the coordinates to avoid large data issues
      const simplifyCoordinates = (coords) =>
        coords.map((ring) =>
          ring
            .filter((_, index) => index % 5 === 0) // Sample every 5th point
            .map(([x, y]) => [
              parseFloat(x.toFixed(4)), // Limit precision to 4 decimal places
              parseFloat(y.toFixed(4)),
            ])
        );

      const simplifiedCoordinates =
        geometry.type === "Polygon"
          ? simplifyCoordinates(geometry.coordinates)
          : geometry.coordinates.map(simplifyCoordinates); // Handle MultiPolygon

      // Transform the geometry into the desired format
      const transformedGeometry = {
        type: geometry.type,
        arcs: simplifiedCoordinates, // Use simplified coordinates
        id: id,
        properties: { name: name }, // Include only essential properties
      };

      // Append the feature to the JSON file
      const featureString = JSON.stringify(transformedGeometry);
      if (result.done) {
        fs.appendFileSync(geojsonPath, `${featureString}`); // No comma for the last feature
        fs.appendFileSync(geojsonPath, "]"); // Close the JSON array
        console.log(`GeoJSON successfully written to ${geojsonPath}`);

        // Convert GeoJSON to TopoJSON
        exec(
          `geo2topo -o ${topojsonPath} ${geojsonPath}`,
          (error, stdout, stderr) => {
            if (error) {
              console.error(
                `Error during GeoJSON to TopoJSON conversion: ${error.message}`
              );
              console.error(`stderr: ${stderr}`);
              return;
            }
            console.log(`TopoJSON successfully written to ${topojsonPath}`);

            // Simplify the TopoJSON
            exec(
              `toposimplify -o ${simplifiedTopojsonPath} --simplify-proportion 0.05 ${topojsonPath}`,
              (error, stdout, stderr) => {
                if (error) {
                  console.error(
                    `Error during TopoJSON simplification: ${error.message}`
                  );
                  console.error(`stderr: ${stderr}`);
                  return;
                }
                console.log(
                  `Simplified TopoJSON successfully written to ${simplifiedTopojsonPath}`
                );
              }
            );
          }
        );
      } else {
        fs.appendFileSync(geojsonPath, `${featureString},`);
      }

      return source.read().then(log);
    })
  )
  .catch((error) => console.error(error.stack));

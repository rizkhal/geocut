import path from "path";
import { randomUUID } from "node:crypto";
import { transoformRequest } from "~/lib/utils";
import {
  statSync,
  readFileSync,
  writeFileSync,
  createWriteStream,
} from "node:fs";
// @ts-ignore
import truncate from "@turf/truncate";

export default defineEventHandler(async (event) => {
  try {
    const body = await readMultipartFormData(event);
    const request = transoformRequest(body);

    const fileName =
      randomUUID() + "." + request.file.filename.split(".").pop();

    const buffer = Buffer.from(request.file.data);
    const outputFileName = path.join("./public/data", fileName);

    const writeStream = createWriteStream(outputFileName);

    await new Promise((resolve, reject) => {
      writeStream.on("finish", resolve);
      writeStream.on("error", reject);
      writeStream.write(buffer);
      writeStream.end();
    });

    const jsonData = readFileSync(outputFileName, "utf8");
    const geojson = JSON.parse(jsonData);

    if (!geojson || !geojson.features) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid geojson format",
      });
    }

    const truncatedGeojson = truncate(geojson, {
      precision: Number(request.precision),
      coordinates: Number(request.coordinates),
    });

    const minifiedGeojson = JSON.stringify(truncatedGeojson, null, 0);

    const destination = path.join("./public/data/generated", fileName);

    writeFileSync(destination, minifiedGeojson);

    const stats = statSync(destination);

    return {
      message: "success",
      file: {
        name: fileName,
        path: destination,
        size: stats.size,
      },
    };
  } catch (error: any) {
    console.log(error);

    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
      stack: error.stack,
    });
  }
});

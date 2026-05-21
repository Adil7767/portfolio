import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default async function Icon() {
  const photo = await readFile(join(process.cwd(), "public/mine.png"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #12141f 0%, #06060b 100%)",
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${photo.toString("base64")}`}
          alt=""
          width={32}
          height={32}
          style={{
            objectFit: "cover",
            objectPosition: "center 20%",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    ),
    { ...size }
  );
}

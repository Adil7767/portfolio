import { ImageResponse } from "next/og";
import { readFile } from "fs/promises";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
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
          background: "linear-gradient(145deg, #7c6dfa 0%, #38bdf8 100%)",
          borderRadius: 36,
          overflow: "hidden",
          padding: 4,
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
            borderRadius: 32,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`data:image/png;base64,${photo.toString("base64")}`}
            alt=""
            width={172}
            height={172}
            style={{
              objectFit: "cover",
              objectPosition: "center 18%",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      </div>
    ),
    { ...size }
  );
}

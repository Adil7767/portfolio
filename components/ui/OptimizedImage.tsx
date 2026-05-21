import Image, { type ImageProps } from "next/image";
import { optimizeCloudinaryUrl } from "@/lib/cloudinary-url";

type Props = Omit<ImageProps, "src"> & {
  src: string;
  width?: number;
  height?: number;
};

export default function OptimizedImage({
  src,
  width = 800,
  height,
  ...props
}: Props) {
  const optimized = optimizeCloudinaryUrl(src, {
    width,
    height,
    crop: height ? "c_fill" : "c_limit",
  });

  return <Image src={optimized} unoptimized={!src.includes("res.cloudinary.com")} {...props} />;
}

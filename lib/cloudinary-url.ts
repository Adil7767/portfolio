/** Client-safe Cloudinary URL transforms (no Node SDK). */
export function optimizeCloudinaryUrl(
  url: string,
  options?: { width?: number; height?: number; crop?: string }
) {
  if (!url.includes("res.cloudinary.com")) return url;

  const transforms = [
    "f_auto",
    "q_auto",
    options?.width && `w_${options.width}`,
    options?.height && `h_${options.height}`,
    options?.crop ?? "c_fill",
  ]
    .filter(Boolean)
    .join(",");

  return url.replace("/upload/", `/upload/${transforms}/`);
}

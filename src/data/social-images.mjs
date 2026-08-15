export function getSocialImagePath(pathname) {
  const route = pathname.split("?")[0].split("#")[0];
  const key =
    route === "/"
      ? "home"
      : route.replace(/^\/+|\/+$/g, "").replaceAll("/", "--");

  return `/social/${key}.png`;
}

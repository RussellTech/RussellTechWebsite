import { handleContact, type RuntimeEnv } from "./api/contact";

const redirectToContact = (
  request: Request,
  params: Record<string, string>,
) => {
  const url = new URL("/contact/", request.url);
  url.search = new URLSearchParams(params).toString();
  return Response.redirect(url, 303);
};

const getMessage = async (response: Response) => {
  try {
    const payload = (await response.clone().json()) as { message?: unknown };
    return typeof payload.message === "string" ? payload.message : "";
  } catch {
    return "";
  }
};

export const onRequestPost: PagesFunction<RuntimeEnv> = async ({
  request,
  env,
}) => {
  const response = await handleContact(request, env);

  if (response.ok) {
    return redirectToContact(request, { submitted: "success" });
  }

  if (response.status === 429) {
    return redirectToContact(request, { error: "rate_limited" });
  }

  if (response.status === 400) {
    const message = await getMessage(response);
    return redirectToContact(request, {
      error: message.includes("spam check") ? "verification" : "invalid",
    });
  }

  return redirectToContact(request, { error: "blocked" });
};

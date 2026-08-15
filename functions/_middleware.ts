import {
  htmlToMarkdown,
  isHtmlResponse,
  markdownHeaders,
  requestsMarkdown,
} from "./markdown-converter";

const appendVaryValue = (headers: Headers, value: string) => {
  const values = new Set(
    (headers.get("Vary") ?? "")
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean),
  );
  values.add(value);
  headers.set("Vary", [...values].join(", "));
};

export const onRequest: PagesFunction = async ({ request, next }) => {
  const response = await next();
  const headers = new Headers(response.headers);
  appendVaryValue(headers, "Accept");

  const contentType = headers.get("Content-Type") ?? "";
  if (
    !requestsMarkdown(request.headers.get("Accept") ?? "") ||
    !isHtmlResponse(contentType) ||
    !response.body
  ) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  try {
    const html = await response.clone().text();
    const markdown = htmlToMarkdown(html);
    const markdownResponse = new Response(markdown, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });

    markdownHeaders(markdown, html).forEach((value, name) =>
      markdownResponse.headers.set(name, value),
    );
    markdownResponse.headers.delete("Content-Encoding");
    markdownResponse.headers.delete("Content-Length");
    markdownResponse.headers.delete("ETag");
    markdownResponse.headers.delete("Last-Modified");
    return markdownResponse;
  } catch (error) {
    console.warn("Failed to convert HTML to Markdown:", error);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
};

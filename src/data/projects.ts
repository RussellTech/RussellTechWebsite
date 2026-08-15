/** Projects currently enabled in the public site. Keep other project content in the repository. */
export const ACTIVE_PROJECT_SLUGS = ["pitcrew"] as const;

export const isActiveProject = (slug: string) =>
  ACTIVE_PROJECT_SLUGS.includes(slug as (typeof ACTIVE_PROJECT_SLUGS)[number]);

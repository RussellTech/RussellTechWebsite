import { describe, expect, it } from "vitest";

import { services } from "../src/data/services";

describe("services catalogue", () => {
  it("contains the expected services in display order", () => {
    expect(services.map((service) => service.number)).toEqual([
      "01",
      "02",
      "03",
      "04",
      "05",
    ]);

    expect(services.map((service) => service.slug)).toEqual([
      "cross-platform-app-development",
      "website-development",
      "bespoke-cms-crm-development",
      "hosting-infrastructure",
      "quality-assurance-testing",
    ]);
  });

  it("keeps each service uniquely addressable", () => {
    const slugs = services.map((service) => service.slug);
    const numbers = services.map((service) => service.number);

    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(numbers).size).toBe(numbers.length);
    expect(slugs.every((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))).toBe(
      true,
    );
  });

  it("provides complete content for every service", () => {
    for (const service of services) {
      expect(service.title).toBeTruthy();
      expect(service.shortTitle).toBeTruthy();
      expect(service.intro).toBeTruthy();
      expect(service.detail).toBeTruthy();
      expect(service.description).toBeTruthy();
      expect(service.points.length).toBeGreaterThan(0);
      expect(new Set(service.points).size).toBe(service.points.length);
    }
  });
});

import { colors, radius, spacing } from "../constants/theme";

describe("theme constants", () => {
  it("exposes the core color palette", () => {
    expect(colors.primary).toBe("#008080");
    expect(colors.deep).toBe("#075e61");
    expect(colors.white).toBe("#ffffff");
  });

  it("keeps spacing values ordered from smallest to largest", () => {
    expect([spacing.xs, spacing.sm, spacing.md, spacing.lg, spacing.xl, spacing.xxl])
      .toEqual([6, 10, 16, 22, 30, 40]);
  });

  it("defines a pill radius larger than the regular radii", () => {
    expect(radius.pill).toBeGreaterThan(radius.lg);
  });
});
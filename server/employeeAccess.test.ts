import { describe, expect, it } from "vitest";
import { employeeRoles } from "../drizzle/schema";

describe("government employee access roles", () => {
  it("defines the five Version 1 roles used for scope assignment and route access", () => {
    expect(employeeRoles).toEqual([
      "state_admin",
      "city_control",
      "zone_engineer",
      "field_technician",
      "auditor",
    ]);
  });

  it("keeps state administration distinct from operational and read-only roles", () => {
    expect(employeeRoles).toContain("state_admin");
    expect(employeeRoles).toContain("city_control");
    expect(employeeRoles).toContain("zone_engineer");
    expect(employeeRoles).toContain("field_technician");
    expect(employeeRoles).toContain("auditor");
  });
});

import { formatPrice } from "./types/catalog";

test("formats USD prices", () => {
  expect(formatPrice(99, null)).toMatch(/^(\$99\.00|\$99)$/);
});

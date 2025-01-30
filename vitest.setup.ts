import "@testing-library/jest-dom/vitest";
import { afterAll } from "vitest";
import { cleanup } from "@testing-library/react";

afterAll(() => {
  cleanup();
});

import { renderHook, act } from "@testing-library/react";
import { useParser } from "@/lib/hooks/parser";
import { describe, it, expect } from "vitest";

describe("useParser hook", () => {
  it("should initialize with idle state", () => {
    const { result } = renderHook(() => useParser());

    expect(result.current.state).toBe("idle");
    expect(result.current.text).toBeUndefined();
    expect(result.current.file).toBeUndefined();
  });

  it("should handle markdown files", async () => {
    const mockFile = new File(["# "], "test.txt", {
      type: "text/plain",
    });

    const { result } = renderHook(() => useParser());

    await act(async () => {
      result.current.setFile(mockFile);
    });

    expect(result.current.state).toBe("success");
    expect(result.current.text).toBe("");
  });

  it("should handle unsupported file types", async () => {
    const mockFile = new File([""], "test.invalid", { type: "invalid/type" });
    const { result } = renderHook(() => useParser(mockFile));

    expect(result.current.state).toBe("error");
  });

  it("should cleanup on unmount", () => {
    const mockFile = new File(["test"], "test.txt", { type: "text/plain" });
    const { result, unmount } = renderHook(() => useParser(mockFile));

    unmount();

    expect(result.current.text).toBeUndefined();
  });
});

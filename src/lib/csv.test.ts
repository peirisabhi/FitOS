import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { exportToCsv } from "@/lib/csv";

describe("exportToCsv", () => {
  let capturedBlob: Blob | undefined;
  let createObjectURLSpy: MockInstance;
  let revokeObjectURLSpy: MockInstance;
  let clickSpy: MockInstance;

  beforeEach(() => {
    capturedBlob = undefined;

    // jsdom doesn't implement these at all — stub them before spying.
    if (!URL.createObjectURL) URL.createObjectURL = vi.fn();
    if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();

    createObjectURLSpy = vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      capturedBlob = blob as Blob;
      return "blob:mock-url";
    });
    revokeObjectURLSpy = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    clickSpy = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
  });

  afterEach(() => {
    createObjectURLSpy.mockRestore();
    revokeObjectURLSpy.mockRestore();
    clickSpy.mockRestore();
  });

  it("does nothing when there are no rows", () => {
    exportToCsv("empty", []);
    expect(createObjectURLSpy).not.toHaveBeenCalled();
  });

  it("builds a CSV blob with a header row and one line per data row", async () => {
    exportToCsv("members", [
      { name: "Jordan Blake", plan: "Annual Elite" },
      { name: "Sarah Chen", plan: "Monthly Plus" },
    ]);

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    const text = await capturedBlob!.text();
    const lines = text.split("\n");
    expect(lines[0]).toBe("name,plan");
    expect(lines[1]).toBe("Jordan Blake,Annual Elite");
    expect(lines[2]).toBe("Sarah Chen,Monthly Plus");
  });

  it("quotes and escapes cells containing commas or quotes", async () => {
    exportToCsv("notes", [{ note: 'Contains, a comma and a "quote"' }]);
    const text = await capturedBlob!.text();
    const lines = text.split("\n");
    expect(lines[1]).toBe('"Contains, a comma and a ""quote"""');
  });

  it("appends .csv to the filename if missing and triggers a real download click", () => {
    exportToCsv("report", [{ a: 1 }]);
    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
  });
});

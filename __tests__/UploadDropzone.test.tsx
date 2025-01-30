import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, it, expect, beforeEach } from "vitest";
import UploadDropzone from "@/components/UploadDropzone";
import { useParser } from "@/lib/hooks";
import { humanFileSize } from "@/lib/utils";

vi.mock("react-dropzone", () => ({
  useDropzone: vi.fn(() => ({
    getRootProps: () => ({}),
    getInputProps: () => ({}),
    isDragActive: false,
  })),
}));

vi.mock("@/lib/hooks", () => ({
  useParser: vi.fn(),
}));

vi.mock("@/lib/utils", () => ({
  humanFileSize: vi.fn(),
}));

vi.mock("@/components/Loader", () => ({
  default: () => <div data-testid="loader">Loader</div>,
}));

describe("UploadDropzone", () => {
  const mockOnFileContent = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Dropzone when no file is selected", () => {
    vi.mocked(useParser).mockReturnValue({
      file: undefined,
      setFile: vi.fn(),
      state: "idle",
      text: undefined,
    });

    render(<UploadDropzone onFileContent={mockOnFileContent} />);

    expect(
      screen.getAllByText(
        "Drag and drop a file here, or click to select a file"
      )[0]
    ).toBeInTheDocument();
    expect(
      screen.getByText("Only .pdf, .docx, .txt, or .md files are accepted")
    ).toBeInTheDocument();
  });

  it("renders FileStatus when a file is selected and processing", () => {
    const mockFile = new File([""], "test.pdf", { type: "application/pdf" });
    vi.mocked(useParser).mockReturnValue({
      file: mockFile,
      setFile: vi.fn(),
      state: "processing",
      text: undefined,
    });
    vi.mocked(humanFileSize).mockReturnValue("1 KB");

    render(<UploadDropzone onFileContent={mockOnFileContent} />);

    expect(screen.getByText("test.pdf")).toBeInTheDocument();
    expect(screen.getByText("1 KB")).toBeInTheDocument();
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders FileStatus when a file is selected and parsing is successful", () => {
    const mockFile = new File([""], "test.pdf", { type: "application/pdf" });
    vi.mocked(useParser).mockReturnValue({
      file: mockFile,
      setFile: vi.fn(),
      state: "success",
      text: "Parsed content",
    });
    vi.mocked(humanFileSize).mockReturnValue("1 KB");

    render(<UploadDropzone onFileContent={mockOnFileContent} />);

    expect(screen.getAllByText("test.pdf")[0]).toBeInTheDocument();
    expect(screen.getAllByText("1 KB")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Parsed")[0]).toBeInTheDocument();
  });

  it("calls onFileContent when parsing is successful", async () => {
    const mockFile = new File([""], "test.pdf", { type: "application/pdf" });
    vi.mocked(useParser).mockReturnValue({
      file: mockFile,
      setFile: vi.fn(),
      state: "success",
      text: "Parsed content",
    });

    render(<UploadDropzone onFileContent={mockOnFileContent} />);

    await waitFor(() => {
      expect(mockOnFileContent).toHaveBeenCalledWith("Parsed content");
    });
  });
});

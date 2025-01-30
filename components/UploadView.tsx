import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import UploadDropzone from "@/components/UploadDropzone";
import Loader from "@/components/Loader";
import type { UploadViewProps } from "@/types";

export default function UploadView({
  state,
  handleContent,
  loaderText,
}: UploadViewProps) {
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="text-4xl font-bold text-center">
          Supercharge your recruitment workflow
        </CardTitle>
        <CardDescription className="text-xl text-center mt-4">
          Our AI agents anonymize CVs, process them, and generate redacted
          versions, streamlining your recruitment process and ensuring unbiased
          evaluations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state === "idle" && <UploadDropzone onFileContent={handleContent} />}
        {loaderText && (
          <Loader
            className="w-full grid justify-center p-4"
            text={loaderText}
          />
        )}
      </CardContent>
    </Card>
  );
}

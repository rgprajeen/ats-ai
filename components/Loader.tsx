import { cn } from "@/lib/utils";
import { LoaderProps } from "@/types";
import { LoaderIcon } from "lucide-react";

export default function Loader({ className, text }: LoaderProps) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center gap-2">
        <LoaderIcon className="h-4 w-4 animate-spin" />
        <span className="ml-2">{text}</span>
      </div>
    </div>
  );
}

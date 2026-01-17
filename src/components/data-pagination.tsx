import { Button } from "@/components/ui/button";

type DataPaginationProps = {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  handlePagination: (direction: "prev" | "next") => void;
};

export const DataPagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  handlePagination,
}: DataPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs md:text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-2">
        <Button
          disabled={!hasPreviousPage}
          variant="outline"
          size="sm"
          onClick={() => handlePagination("prev")}
        >
          Previous
        </Button>
        <Button
          disabled={!hasNextPage}
          variant="outline"
          size="sm"
          onClick={() => handlePagination("next")}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

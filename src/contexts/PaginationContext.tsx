import React, { createContext, useContext, useState, ReactNode } from "react";
import { PaginationState } from "../types/countries";

interface PaginationContextType {
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  handlePageChange: (newPage: number) => void;
  resetPagination: () => void;
}

const PaginationContext = createContext<PaginationContextType | undefined>(
  undefined
);

export const PaginationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
  });

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination((prev) => ({
        ...prev,
        currentPage: newPage,
      }));
    }
  };

  const resetPagination = () => {
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }));
  };

  return (
    <PaginationContext.Provider
      value={{ pagination, setPagination, handlePageChange, resetPagination }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = (): PaginationContextType => {
  const context = useContext(PaginationContext);
  if (context === undefined) {
    throw new Error("usePagination must be used within a PaginationProvider");
  }
  return context;
};

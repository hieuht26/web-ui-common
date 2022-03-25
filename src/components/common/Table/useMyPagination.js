import { useEffect, useState } from "react";

const DEFAULT_PAGE_OPTIONS = {
  rowsPerPageOptions: [5, 10, 25],
  defaultPageSize: 5,
  defaultPageNum: 0,
};

export default function useMyPagination(pageOptions) {
  const [pageNum, setPageNum] = useState(DEFAULT_PAGE_OPTIONS.defaultPageNum);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_OPTIONS.defaultPageSize);
  const [rowsPerPageOptions, setRowsPerPageOptions] = useState(DEFAULT_PAGE_OPTIONS.rowsPerPageOptions);

  useEffect(() => {
    if (pageOptions?.pageNum !== null && pageOptions?.pageNum !== undefined) {
      setPageNum(pageOptions.pageNum);
    }
  }, [pageOptions.pageNum]);

  useEffect(() => {
    if (pageOptions?.pageSize !== null && pageOptions?.pageSize !== undefined) {
      setPageSize(pageOptions.pageSize);
    }
  }, [pageOptions.pageSize]);

  useEffect(() => {
    if (pageOptions?.rowsPerPageOptions !== null && pageOptions?.rowsPerPageOptions !== undefined) {
      setRowsPerPageOptions(pageOptions.rowsPerPageOptions);
    }
  }, [pageOptions.rowsPerPageOptions]);

  return {
    pageNum,
    pageSize,
    rowsPerPageOptions,
    setPageNum,
    setPageSize
  }
};
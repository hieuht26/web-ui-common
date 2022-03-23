import React, { useEffect } from "react";
import classNames from "classnames";
import {
  useTable,
  useSortBy,
  useResizeColumns,
  useBlockLayout,
  getRowId,
} from "react-table";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import PropTypes from "prop-types";
import update from "immutability-helper";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

import "./commonTable.scss";
import DragRow from "./DragRow";
import usePagination from "./usePagination";


const CommonTable = (props) => {
  const { columns, data, customClass, canResize, canDragDrop, pageOptions } = props;
  const [records, setRecords] = React.useState(data.records);
  const {
    pageNum,
    pageSize,
    rowsPerPageOptions,
    setPageNum,
    setPageSize
  } = usePagination(pageOptions);

  const getRowIdForResize = React.useCallback((row) => {
    return row.id;
  }, []);

  let plugins = [
    useSortBy
  ];
  if (canResize) {
    plugins = [...plugins, useBlockLayout, useResizeColumns];
  }

  const {
    getTableBodyProps,
    getTableProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: records,
      getRowId: !canResize && canDragDrop ? getRowIdForResize : getRowId,

    },
    ...plugins
  );

  const handleChangePage = (event, newPage) => {
    setPageNum(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPageNum(0);
  };

  const moveRow = (dragIndex, hoverIndex) => {
    const dragRecord = records[dragIndex];
    setRecords(
      update(records, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, dragRecord],
        ],
      })
    );
  };

  const removeClick = (e) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setRecords(data.records);
  }, [data]);

  useEffect(() => {
    if (pageOptions?.handleChangePage) {
      pageOptions.handleChangePage({ pageNum, pageSize })
    }
      
  }, [pageNum, pageSize]);

  return (
    <div className={classNames("common-ui__table", customClass)}>
      {/* <DndProvider backend={HTML5Backend}> */}
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    <TableCell
                      {...column.getHeaderProps(
                        column?.sort
                          ? column.getSortByToggleProps({ title: undefined })
                          : undefined
                      )}
                      // onClick={() => column.toggleSortBy(!column.isSortedDesc)} // uncomment to custom sort by click icon
                    >
                      <div className="common-ui__table__header">
                        {column.render("Header")}
                        {column?.sort && (
                          <i
                            className={classNames(
                              column.isSorted
                                ? "common-ui__table--sort"
                                : "common-ui__table--unsort",
                              column.isSortedDesc
                                ? "common-ui__table--sort--desc"
                                : column.isSorted
                                ? "common-ui__table--sort--asc"
                                : ""
                            )}
                          >
                            <ArrowDownwardIcon className="icon-down" />
                            <ArrowUpwardIcon className="icon-up" />
                          </i>
                        )}
                        {canResize && (
                          <div
                            {...column.getResizerProps()}
                            onClick={removeClick}
                            className={`common-ui__table__resizer ${
                              column.isResizing
                                ? "common-ui__table__resizer--resizing"
                                : ""
                            }`}
                          />
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {rows.map((row, index) => {
              prepareRow(row);
              return !canResize && canDragDrop ? (
                <DragRow
                  index={index}
                  row={row}
                  moveRow={moveRow}
                  {...row.getRowProps()}
                />
              ) : (
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <TableCell {...cell.getCellProps()}>
                        {cell.render("Cell")}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </MuiTable>
      {/* </DndProvider> */}
      <TablePagination
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={100}
          rowsPerPage={pageSize}
          page={pageNum}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangePageSize}
        />
    </div>
  );
};

CommonTable.propTypes = {
  customClass: PropTypes.string,
  canDragDrop: PropTypes.bool,
  canResize: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string, //title
      accessor: PropTypes.string,
      className: PropTypes.string,
      columns: PropTypes.array,
      style: PropTypes.object,
      sort: PropTypes.bool,
    })
  ),
  data: PropTypes.shape({
    records: PropTypes.array,
    totalCount: PropTypes.number
  }),
  pageOptions: PropTypes.shape({
    rowsPerPageOptions: PropTypes.array,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    handleChangePage: PropTypes.func
  }),
};

CommonTable.defaultProps = {
  customClass: null,
  canDragDrop: false, // canResize and canDragDrop cannot be the same true
  canResize: false,
  columns: [],
  data: {
    records: [],
    totalCount: 0
  },
  pageOptions: {
    handleChangePage: () => {}
  }
};

const withTable = (Component) => {
  return (props) => {
    if (props.canDragDrop) {
      return <DndProvider backend={HTML5Backend}><Component {...props} /></DndProvider>;
    }
    return <Component {...props} />;
  }
};

export default withTable(CommonTable);
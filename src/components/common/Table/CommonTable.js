import React, { useEffect } from "react";
import classNames from "classnames";
import {
  useTable,
  useSortBy,
  useResizeColumns,
  usePagination,
  useBlockLayout,
  useRowSelect,
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
import useMyPagination from "./useMyPagination";
import makeData, { columns } from "./makeData";
import CommonCheckbox from "../Checkbox/Checkbox";

const CommonTable = (props) => {
  const { columns, data, customClass, canResize, canDragDrop, canSelect,
    pageOptions, listDisableCheckbox, haveCheckAll, handleSelectedRowsChange,
    havePagination
  } = props;
  const [records, setRecords] = React.useState(data.records);
  const { pageNum, pageSize, rowsPerPageOptions, setPageNum, setPageSize } =
    useMyPagination(pageOptions);

  const selectionHook = React.useCallback(hooks => {
    hooks.visibleColumns.push(columns => [
      // Let's make a column for selection
      {
        id: 'selection',
        disableResizing: true,
        minWidth: 35,
        width: 35,
        maxWidth: 35,
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ rows, getToggleAllPageRowsSelectedProps, selectedFlatRows }) => {
          const changeableRows = rows.filter((row) => !row.disableCheckbox);

          const allSelected = changeableRows.every((row) => {
            return selectedFlatRows.findIndex(selected => selected.id === row.id) > -1;
          });
          const onChange = (e) => {
            e.stopPropagation();
            changeableRows.forEach((row) => row.toggleRowSelected(!allSelected));
          };
          return (
            <div>
              {haveCheckAll && <CommonCheckbox {...getToggleAllPageRowsSelectedProps()} title={undefined} checked={allSelected} onChange={onChange} />}
            </div>
          );
        },
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => {
          return (
            <div>
              <CommonCheckbox {...row.getToggleRowSelectedProps()} title={undefined} disabled={row.disableCheckbox} />
            </div>
          );
        },
      },
      ...columns,
    ])
  }, [haveCheckAll]);

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  let plugins = [useSortBy, 
    usePagination
  ];
  if (canResize) {
    plugins = [...plugins, useBlockLayout, useResizeColumns];
  }
  if (canSelect) {
    plugins = [...plugins, useRowSelect, selectionHook];
  }

  const { getTableBodyProps, getTableProps, headerGroups, page, prepareRow, selectedFlatRows,
    state: { selectedRowIds }
  } =
    useTable(
      {
        columns,
        data: records,
        getRowId,
      },
      ...plugins,
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
      pageOptions.handleChangePage({ pageNum, pageSize });
    }
  }, [pageNum, pageSize]);

  useEffect(() => {
    // console.log(selectedFlatRows, selectedRowIds)
    if (handleSelectedRowsChange) {
      handleSelectedRowsChange(selectedFlatRows, selectedRowIds)
    }
  }, [selectedFlatRows]);

  return (
    <div className={classNames("common-ui__table", customClass)}>
      <div className={classNames("common-ui__table__wrapper")}>
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
                        {column.canFilter && (
                          <div className="common-ui__table__filter">
                            {column.render("Filter")}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody {...getTableBodyProps()}>
            {page.map((row, index) => {
              let rowWithCustomProp = row;
              if (listDisableCheckbox.indexOf(row.id) > -1) {
                rowWithCustomProp = Object.assign(row, { disableCheckbox: true });
              }
              prepareRow(rowWithCustomProp);
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
      </div>
      {havePagination && <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={100}
        rowsPerPage={pageSize}
        page={pageNum}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
      />}
    </div>
  );
};

CommonTable.propTypes = {
  customClass: PropTypes.string,
  canDragDrop: PropTypes.bool,
  canResize: PropTypes.bool,
  canSelect: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.any, // String | Function | React.Component
      accessor: PropTypes.string,
      className: PropTypes.string,
      columns: PropTypes.array,
      style: PropTypes.object,
      sort: PropTypes.bool,
      Filter: PropTypes.element,
      Cell: PropTypes.element, // Custom cell: ({ value, row }) => { return element }
    })
  ),
  data: PropTypes.shape({
    records: PropTypes.array,
    totalCount: PropTypes.number,
  }),
  havePagination: PropTypes.bool,
  pageOptions: PropTypes.shape({
    rowsPerPageOptions: PropTypes.array,
    totalCount: PropTypes.number,
    pageSize: PropTypes.number,
    pageNum: PropTypes.number,
    handleChangePage: PropTypes.func,
  }),
  listDisableCheckbox: PropTypes.array, // list row id to disable checkbox
  haveCheckAll: PropTypes.bool,
  handleSelectedRowsChange: PropTypes.func
};

CommonTable.defaultProps = {
  customClass: null,
  canDragDrop: false, // canResize and canDragDrop cannot be the same true
  canResize: false,
  canSelect: false,
  columns: [],
  data: {
    records: [],
    totalCount: 0,
  },
  havePagination: true,
  pageOptions: {
    handleChangePage: () => {},
  },
  listDisableCheckbox: [],
  haveCheckAll: true,
  handleSelectedRowsChange: () => {}
};

const withTable = (Component) => {
  return (props) => {
    if (props.canDragDrop) {
      return (
        <DndProvider backend={HTML5Backend}>
          <Component {...props} />
        </DndProvider>
      );
    }
    return <Component {...props} />;
  };
};

const withExampleTable = (Component) => {
  return () => {
    const [data, setData] = React.useState(makeData(10));
    const listDisableCheckbox = ["T2"];

    const handleChangePage = ({ pageNum, pageSize }) => {
      setData(makeData(pageSize));
    };

    const pageOptions = {
      handleChangePage,
      totalCount: 100,
    };

    return (
      <Component
        data={data}
        columns={columns}
        pageOptions={pageOptions}
        canDragDrop
        canSelect
        listDisableCheckbox={listDisableCheckbox}
      />
    );
  };
};

export default withTable(CommonTable);

export const ExampleTable = withExampleTable(withTable(CommonTable));

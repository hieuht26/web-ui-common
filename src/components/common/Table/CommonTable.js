import React, { useEffect } from "react";
import classNames from "classnames";
import {
  useTable,
  useSortBy,
  useResizeColumns,
  usePagination,
  useBlockLayout,
  // useMountedLayoutEffect,
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
// import CommonCheckbox from "../Checkbox/Checkbox";

const CommonTable = (props) => {
  const { columns, data, customClass, canResize, canDragDrop,
    pageOptions, listDisableCheckbox, haveCheckAll, handleSelectedRowsChange,
    havePagination, handleUpdateDragDrop, blockId, selectedRowsId, haveCheckbox
  } = props;
  const [records, setRecords] = React.useState(data.records);
  const [isSelectAll, toggleSelectAll] = React.useState(false);
  const { pageNum, pageSize, rowsPerPageOptions, setPageNum, setPageSize } =
    useMyPagination(pageOptions);

  const getRowId = React.useCallback((row) => {
    return row.id;
  }, []);

  let plugins = [useSortBy, 
    usePagination
  ];
  if (canResize) {
    plugins = [...plugins, useBlockLayout, useResizeColumns];
  }
  const { getTableBodyProps, getTableProps, headerGroups, page, prepareRow } =
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
    const newRecords = update(records, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, dragRecord],
      ],
    });
    setRecords(newRecords);
    if (handleUpdateDragDrop) {
      handleUpdateDragDrop(newRecords);
    }
  };

  const removeClick = (e) => {
    e.stopPropagation();
  };

  const handleSelectAll = React.useCallback((selectedRowsId) => {
    let newSelectedRowsId = {
      ...selectedRowsId
    };
    const newSelectedRows = [];
    data.records.forEach(item => {
      if (listDisableCheckbox.indexOf(item.id) > -1) return;
      newSelectedRowsId[item.id] = !isSelectAll;
      if (!isSelectAll) {
        newSelectedRows.push(item);
      }
    });
    handleSelectedRowsChange(newSelectedRows, newSelectedRowsId);
  }, [data.records, selectedRowsId, listDisableCheckbox, isSelectAll]);

  const handleSelectRow = React.useCallback((row, isChecked) => {
    const newSelectedRowsId = {
      ...selectedRowsId,
      [row.id]: !isChecked
    };
    const newSelectedRows = data.records.filter(item => newSelectedRowsId[item.id]);
    handleSelectedRowsChange(newSelectedRows, newSelectedRowsId);
  }, [data.records, selectedRowsId]);

  const checkSelectAll = React.useCallback(() => {
    const isSelectAll = data?.records.every(item => {
      return selectedRowsId[item.id] || listDisableCheckbox.indexOf(item.id) > -1;
    });
    toggleSelectAll(isSelectAll);
  }, [data.records, selectedRowsId, listDisableCheckbox]);

  useEffect(() => {
    checkSelectAll(data, selectedRowsId);
  }, [data, selectedRowsId])

  useEffect(() => {
    setRecords(data.records);
  }, [data]);

  useEffect(() => {
    if (pageOptions?.handleChangePage) {
      pageOptions.handleChangePage({ pageNum, pageSize });
    }
  }, [pageNum, pageSize]);
  return (
    <div id={blockId} className={classNames("common-ui__table", customClass)}>
      <div className={classNames("common-ui__table__wrapper")}>
        <MuiTable {...getTableProps()}>
          <TableHead>
            {headerGroups.map((headerGroup) => (
              <TableRow {...headerGroup.getHeaderGroupProps()}>
                {haveCheckbox && (
                  <TableCell>
                    {/* <CommonCheckbox checked={isSelectAll} onChange={handleSelectAll} /> */}
                    {haveCheckAll ? <input type="checkbox" onChange={() => handleSelectAll()} checked={isSelectAll} /> : <i />}
                  </TableCell>
                )}
                {headerGroup.headers.map((column) => {
                  return (
                    <TableCell
                      {...column.getHeaderProps(
                        column?.sort
                          ? column.getSortByToggleProps({ title: undefined })
                          : undefined
                      )}
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
                  haveCheckbox={haveCheckbox}
                  onSelectRow={() => handleSelectRow(row?.original, selectedRowsId[row.id])}
                  rowIsChecked={selectedRowsId[row.id]}
                  disabledCheckbox={listDisableCheckbox.indexOf(row.id) > -1}
                  {...row.getRowProps()}
                />
              ) : (
                <TableRow {...row.getRowProps()}>
                  {haveCheckbox && (
                    <TableCell>
                      {/* <CommonCheckbox onChange={() => handleSelectRow(row, selectedRowsId[row.id], selectedRowsId)} checked={selectedRowsId[row.id]} /> */}
                      <input type="checkbox" onChange={() => handleSelectRow(row, selectedRowsId[row.id])} disabled={listDisableCheckbox.indexOf(row.id) > -1} checked={selectedRowsId[row.id]} />
                    </TableCell>
                  )}
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
        count={data.totalCount}
        rowsPerPage={pageSize}
        page={pageNum}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangePageSize}
      />}
    </div>
  );
};

CommonTable.propTypes = {
  blockId: PropTypes.string.isRequired,
  customClass: PropTypes.string,
  canDragDrop: PropTypes.bool,
  handleUpdateDragDrop: PropTypes.func,
  canResize: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.any, // String | Function | React.Component
      accessor: PropTypes.string,
      id: PropTypes.string,
      className: PropTypes.string,
      columns: PropTypes.array,
      style: PropTypes.object,
      sort: PropTypes.bool,
      Filter: PropTypes.element,
      Cell: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.element
      ]), // Custom cell: ({ value, row }) => { return element }
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
  haveCheckbox: PropTypes.bool,
  haveCheckAll: PropTypes.bool,
  handleSelectedRowsChange: PropTypes.func,
  selectedRowsId: PropTypes.object
};

CommonTable.defaultProps = {
  blockId: "common-table",
  customClass: null,
  canDragDrop: false, // canResize and canDragDrop cannot be the same true
  handleUpdateDragDrop: () => {},
  canResize: false,
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
  haveCheckbox: false,
  haveCheckAll: true,
  handleSelectedRowsChange: () => {},
  selectedRowsId: {}
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
        haveCheckbox
        listDisableCheckbox={listDisableCheckbox}
      />
    );
  };
};

export default withTable(CommonTable);

export const ExampleTable = withExampleTable(withTable(CommonTable));

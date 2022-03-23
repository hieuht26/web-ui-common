import React, { useEffect } from "react";
import styled from "styled-components";
import classNames from "classnames";
import { useTable } from "react-table";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import update from "immutability-helper";
import MuiTable from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import PropTypes from "prop-types";
import makeData, { columns } from "./makeData";

const CommonTable = (props) => {
  const { columns, data, customClass } = props;
  const [records, setRecords] = React.useState(data);

  const { getTableProps, headerGroups, rows, prepareRow } = useTable({
    columns,
    data: records,
  });

  useEffect(() => {
    setRecords(data);
  }, [data]);

  return (
    <div className={classNames("common-ui__table", customClass)}>
      <MuiTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map((headerGroup) => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            prepareRow(row);
            return (
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
  );
};

CommonTable.propTypes = {
  customClass: PropTypes.string,
  canDragDrop: PropTypes.bool,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      Header: PropTypes.string, //title
      accessor: PropTypes.string,
      columns: PropTypes.array,
    })
  ),
};

CommonTable.defaultProps = {
  canDragDrop: false,
  columns: [],
  data: [],
  customClass: null
};

export default CommonTable;

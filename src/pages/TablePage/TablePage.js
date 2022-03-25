import React from 'react';
import makeData, { columns } from 'components/common/Table/makeData';
import { CommonTable } from 'components';
import "./tablePage.scss";
import { Button } from '@mui/material';

function TablePage() {

  const listDisableCheckbox = ["T2"];
  // const [selectedRows, setSelectedRows] = React.useState({ [`T${Math.floor(Math.random() * 10)}`]: true });
  const [selectedRows, setSelectedRows] = React.useState({});
  const [data, setData] = React.useState(makeData(10));


  const handleChangePage = ({ pageNum, pageSize }) => {
    setData(makeData(pageSize));
  }

  const pageOptions = {
    handleChangePage,
    totalCount: 100,
  }

  const onAddRowSelectedRandom = () => {
    const newSelectedRow = `T${Math.floor(Math.random() * 10)}`
    setSelectedRows({
      ...selectedRows,
      [newSelectedRow]: true
    }) 
  }

  const handleSelectRow = (row) => {
    setSelectedRows({
      ...selectedRows,
      [row.id]: true
    }) 
  }

  const handleSelectedRowsChange = (selectedRecords, selectedRowIds) => {
    setSelectedRows({
      ...selectedRows,
      ...selectedRowIds
    });
  }

  React.useEffect(() => {
    // console.log(selectedRows)
  }, [selectedRows])

  const columns2 = React.useMemo(() => [
    {
      Header: 'Action',
      Cell: ({ row }) => {
        return <Button onClick={() => handleSelectRow(row)}>test</Button>
      },
    },
    {
      Header: <i>First Name</i>,
      accessor: 'firstName',
      id: 'firstName',
      sort: true
    },
    {
      Header: 'Last Name',
      accessor: 'lastName',
      id: 'lastName',
    },
    {
      Header: 'Age',
      accessor: 'age',
      id: 'age',
    },
    {
      Header: 'Visits',
      accessor: 'visits',
      id: 'visits',
    },
    {
      Header: 'Status',
      accessor: 'status',
      id: 'status',
    },
    {
      Header: 'Profile Progress',
      accessor: 'progress',
      id: 'progress',
    },
  ], [selectedRows]);


  return (
    <div className="table-page">
      <button onClick={onAddRowSelectedRandom}>Add selected row</button>
      <CommonTable
        data={data}
        columns={columns2}
        pageOptions={pageOptions}
        canDragDrop
        haveCheckbox={true}
        listDisableCheckbox={listDisableCheckbox}
        handleSelectedRowsChange={handleSelectedRowsChange}
        selectedRowsId={selectedRows}
        // haveCheckAll={false}
        // havePagination={false}
      />
    </div>
  );
}

export default TablePage;

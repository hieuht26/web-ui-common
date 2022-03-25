import React from 'react';
import makeData, { columns } from 'components/common/Table/makeData';
import { CommonTable } from 'components';
import "./tablePage.scss";

function TablePage() {

  const listDisableCheckbox = ["T2"];
  const [selectedRows, setSelectedRows] = React.useState({ [`T${Math.floor(Math.random() * 10)}`]: true });
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

  const columns2 = [
    {
      Header: 'Name',
      columns: [
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
      ],
    },
    {
      Header: 'Info',
      columns: [
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
      ],
    },
  ];


  return (
    <div className="table-page">
      <button onClick={onAddRowSelectedRandom}>Add selected row</button>
      <CommonTable
        data={data}
        columns={columns2}
        pageOptions={pageOptions}
        canDragDrop
        canSelect={true}
        listDisableCheckbox={listDisableCheckbox}
        // havePagination={false}
      />
    </div>
  );
}

export default TablePage;

import React from 'react';
import makeData, { columns } from 'components/common/Table/makeData';
import { CommonTable } from 'components';
import "./tablePage.scss";

function TablePage() {

  const [data, setData] = React.useState(makeData(10));


  const handleChangePage = ({ pageNum, pageSize }) => {
    setData(makeData(pageSize));
  }

  const pageOptions = {
    handleChangePage,
    totalCount: 100,
  }

  return (
    <div className="table-page">
      <CommonTable
        data={data}
        columns={columns}
        pageOptions={pageOptions}
        canDragDrop
      />
    </div>
  );
}

export default TablePage;

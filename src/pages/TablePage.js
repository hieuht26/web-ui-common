import React from 'react';
import makeData, { columns } from 'components/common/Table/makeData';
import { CommonTable } from 'components';

function TablePage() {
  const data = makeData(20);
  return (
    <div>
      <CommonTable data={data} columns={columns} />
    </div>
  );
}

export default TablePage;

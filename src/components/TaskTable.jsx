import { Box, Button, ButtonGroup, Icon, Text } from '@chakra-ui/react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useState } from 'react';
import DATA from '../data';
import EditableCell from './EditableCell';
import StatusCell from './StatusCell';
import DateCell from './DateCell';
import Filters from './Filters';
import SortIcon from './icons/SortIcon';

const columns = [
  {
    accessorKey: 'task',
    header: 'TASK',
    size: 120,
    cell: EditableCell,
    enableColumnFilter: true,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'status',
    header: 'STATUS',
    cell: StatusCell,
    enableColumnFilter: true,
    // tanstack가 자동으로 filterValue를 넣어줌
    filterFn: (row, columnId, filterStatuses) => {
      if (filterStatuses.length === 0) return true;
      const status = row.getValue(columnId);
      return filterStatuses.includes(status?.id);
    },
    enableSorting: false,
  },
  {
    accessorKey: 'due',
    header: 'DUE',
    cell: DateCell,
  },
  {
    accessorKey: 'notes',
    header: 'NOTE',
    size: 120,
    cell: EditableCell,
  },
];

const TaskTable = () => {
  const [data, setData] = useState(DATA);
  // filtering
  const [columnFilters, setColumnFilters] = useState([
    {
      id: 'task',
      value: 'Add',
    },
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    columnResizeMode: 'onChange',
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // pagination
    state: {
      // Tanstack가 만든거
      // 테이블의 UI 상태값 (페이징, 필터 )
      columnFilters,
    },
    meta: {
      // 커스텀 값 ( Tanstank 공식 state가 아닌 개발자가 만든거 )
      updateData: (rowIndex, columnId, value) =>
        setData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...prev[rowIndex], [columnId]: value } : row,
          ),
        ),
    },
  });
  console.log(columnFilters);
  // console.log(table.getHeaderGroups());
  // console.log(table.getRowModel());
  return (
    <Box>
      <Filters
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      {/* 헤더 */}
      <Box className="table" w={table.getTotalSize()}>
        {table.getHeaderGroups().map((headerGroup) => (
          <Box className="tr" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Box className="th" w={header.getSize()} key={header.id}>
                {header.column.columnDef.header}
                {header.column.getCanSort() && (
                  <Icon
                    as={SortIcon}
                    mx={3}
                    fontSize={14}
                    onClick={header.column.getToggleSortingHandler()}
                  />
                )}

                {
                  {
                    asc: '위로',
                    desc: '아래로',
                  }[header.column.getIsSorted()]
                }
                <Box
                  onTouchStart={header.getResizeHandler()}
                  onMouseDown={header.getResizeHandler()}
                  className={`
                  resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`}
                />
              </Box>
            ))}
          </Box>
        ))}
        {/* 바디 */}
        {table.getRowModel().rows.map((row) => (
          <Box className="tr" key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Box className="td" w={cell.column.getSize()} key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      <br />
      <Text mb={2}>
        Page {table.getState().pagination.pageIndex + 1} of
        {table.getPageCount()}
      </Text>
      <ButtonGroup size="sm" isAttached variant="outline">
        <Button
          onClick={() => table.previousPage()}
          isDisabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </Button>
        <Button
          onClick={() => table.nextPage()}
          isDisabled={!table.getCanNextPage()}
        >
          {'>'}
        </Button>
      </ButtonGroup>
    </Box>
  );
};
export default TaskTable;

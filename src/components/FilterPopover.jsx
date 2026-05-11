import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Icon,
  Text,
  VStack,
  Flex,
  Button,
} from '@chakra-ui/react';
import FilterIcon from './icons/FilterIcon';
import { STATUSES } from '../data';
import { ColorIcon } from './StatusCell';

const StatusItem = ({ status, setColumnFilters, isActive }) => (
  <Flex
    align="center"
    cursor="pointer"
    borderRadius={5}
    fontWeight="bold"
    bg={isActive ? 'gray.800' : 'transparent'}
    p={1.5}
    _hover={{ bg: 'gray.800' }}
    onClick={() => {
      setColumnFilters((prev) => {
        const statuses = prev.find((filter) => filter.id === 'status')?.value;
        // status 가 없었으면 , 다른 필터값에 그냥 더해준다
        if (!statuses) {
          return prev.concat({
            id: 'status',
            value: [status.id],
          });
        }

        // status 가 이미 있는 경우
        return prev.map((f) =>
          f.id === 'status'
            ? {
                ...f,
                value: isActive // 이미 선택된 상태인경우 제거
                  ? statuses.filter((s) => s !== status.id)
                  : statuses.concat(status.id),
              }
            : f,
        );
      });
    }}
  >
    <ColorIcon color={status.color} mr={3} />
    {status.name}
  </Flex>
);

const FilterPopover = ({ columnFilters, setColumnFilters }) => {
  const filterStatuses =
    columnFilters.find((f) => f.id === 'status')?.value || [];

  return (
    <Popover isLazy>
      <PopoverTrigger>
        <Button size="sm" leftIcon={<Icon as={FilterIcon} fontSize={18} />}>
          Filter
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Text fontSize="md" fontWeight="bold" mb={4}>
            Filter By :
          </Text>
          <Text fontWeight="bold" color="gray.400" mb={1}>
            Status
          </Text>
          <VStack align="flex-start" spacing={1}>
            {STATUSES.map((status) => (
              <StatusItem
                isActive={filterStatuses.includes(status.id)}
                status={status}
                key={status.id}
                setColumnFilters={setColumnFilters}
              />
            ))}
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default FilterPopover;

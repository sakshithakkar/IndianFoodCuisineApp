import { DetailsList, Dropdown, TextField, Stack } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { getAllDishes } from '../services/dishService';
import { Link } from 'react-router-dom';

// import { DefaultButton } from '@fluentui/react';


const DishList = () => {
  const [dishes, setDishes] = useState([]);
  const [filter, setFilter] = useState({ diet: '' });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [sort, setSort] = useState({ key: 'name', order: 'asc' });
  const [search, setSearch] = useState({ flavor: '', state: '' });
  const [debouncedFilter, setDebouncedFilter] = useState({ flavor: '', state: '' });

  const onColumnClick = (ev, column) => {
    const isSortedAsc = sort.key === column.fieldName && sort.order === 'asc';
    setSort({ key: column.fieldName, order: isSortedAsc ? 'desc' : 'asc' });
  };

  const getColumn = (key, fieldName, displayName) => ({
    key,
    fieldName,
    name: displayName,
    // name: sort.key === fieldName
    //   ? `${displayName} ${sort.order === 'asc' ? '▲' : '▼'}`
    //   : displayName,
    onRender: item => {
      if (fieldName === 'name') {
        return (
          <Link to={`/dish/${item.id}`} style={{ color: '#0078d4', textDecoration: 'none' }}>
            {item.name}
          </Link>
        );
      }
      return item[fieldName];
    },
    onColumnClick: onColumnClick,
    isSorted: sort.key === fieldName,
    isSortedDescending: sort.order === 'desc',
  });

  // const pageButtons = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

  const columns = [
    getColumn('name', 'name', 'Dish Name'),
    getColumn('prep_time', 'prep_time', 'Prep Time'),
    getColumn('cook_time', 'cook_time', 'Cook Time'),
    { key: 'diet', name: 'Diet', fieldName: 'diet' },
    { key: 'state', name: 'State', fieldName: 'state' },
    { key: 'flavour', name: 'Flavour', fieldName: 'flavor_profile' },
    { key: 'course', name: 'Course', fieldName: 'course' },
    { key: 'region', name: 'Region', fieldName: 'region' },
  ];

  useEffect(() => {
    const finalFilter = {
      diet: filter.diet,
      flavor: debouncedFilter.flavor,
      state: debouncedFilter.state,
    };

    getAllDishes({ ...finalFilter, sort: sort.key, order: sort.order }, page).then((res) => {
      setDishes(res.data.data);
      setPagination(res.data.pagination);
    });
  }, [filter.diet, debouncedFilter, page, sort]);


  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilter({ ...search });
    }, 1500); // 1500ms debounce

    return () => clearTimeout(handler); // cancel timeout on new input
  }, [search]);

  return (
    <Stack tokens={{ childrenGap: 15 }}>
      <Stack horizontal tokens={{ childrenGap: 15 }}>
        <Dropdown
          placeholder="Filter by Diet"
          options={[{ key: '', text: 'All' }, { key: 'vegetarian', text: 'Veg' }, { key: 'non vegetarian', text: 'Non-Veg' }]}
          onChange={(_, option) => {
            setPage(1); // reset to page 1 when filter changes
            setFilter(f => ({ ...f, diet: option.key }));
          }}
        />
        <TextField
          label="Filter by Flavor"
          onChange={(_, newVal) => {
            setPage(1);
            setSearch(s => ({ ...s, flavor: newVal }));
          }}
        />
        <TextField
          label="Filter by State"
          onChange={(_, newVal) => {
            setPage(1);
            setSearch(s => ({ ...s, flavor: newVal }));
          }}
        />
      </Stack>

      <DetailsList items={dishes} columns={columns} />
      <Stack horizontal tokens={{ childrenGap: 10 }}>
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {pagination.totalPages}</span>
        <button disabled={page >= pagination.totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </Stack>

      {/* <Stack horizontal tokens={{ childrenGap: 5 }}>
        {pageButtons.map(p => (
          <DefaultButton
            key={p}
            text={p.toString()}
            onClick={() => setPage(p)}
            styles={{
              root: { backgroundColor: page === p ? '#0078d4' : 'transparent', color: page === p ? 'white' : 'black' }
            }}
          />
        ))}
      </Stack> */}


    </Stack>
  );
};

export default DishList;

import { DetailsList, Dropdown, TextField, Stack, DefaultButton, Label, MessageBar, Icon } from '@fluentui/react';
import { useEffect, useState } from 'react';
import { getAllDishes } from '../services/dishService';
import { Link, useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { formatDishValue } from '../utils/formatValue';

const DishList = () => {
  const savedFilters = JSON.parse(localStorage.getItem('dishFilters')) || {};

  const [filter, setFilter] = useState({ diet: savedFilters.diet || '' });
  const [search, setSearch] = useState({
    flavor: savedFilters.flavor || '',
    state: savedFilters.state || ''
  });
  const [page, setPage] = useState(savedFilters.page || 1);
  const [sort, setSort] = useState(savedFilters.sort || { key: 'name', order: 'asc' });
  const [dishes, setDishes] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [showMessage, setShowMessage] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isFilterActive =
    filter.diet !== '' || search.flavor !== '' || search.state !== '' ||
    page !== 1 || sort.key !== 'name' || sort.order !== 'asc';

  const navigate = useNavigate()

  const handleAddDish = () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/add-dish');
    } else {
      setShowMessage(true);
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  const debouncedSearch = useDebounce(search, 1000);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        setErrorMsg(''); // Clear previous error
        const finalFilter = {
          diet: filter.diet,
          flavor: debouncedSearch.flavor,
          state: debouncedSearch.state,
        };

        const res = await getAllDishes({ ...finalFilter, sort: sort.key, order: sort.order }, page);
        setDishes(res.data.data);
        setPagination(res.data.pagination);
      } catch (error) {
        console.error('Failed to fetch dishes:', error);
        if (error.response) {
          // Server responded with an error status
          if (error.response.status === 404) {
            setErrorMsg('No dishes found matching your filters.');
          } else if (error.response.status === 500) {
            setErrorMsg('Internal server error. Please try again later.');
          } else {
            setErrorMsg(`Error: ${error.response.statusText}`);
          }
        } else if (error.request) {
          // Server is not reachable
          setErrorMsg('Server is unreachable. Please check your internet or try again later.');
        } else {
          // Something else
          setErrorMsg('Something went wrong. Please try again.');
        }
      }
    };

    fetchDishes();
  }, [filter.diet, debouncedSearch, page, sort]);

  useEffect(() => {
    localStorage.setItem('dishFilters', JSON.stringify({
      diet: filter.diet,
      flavor: search.flavor,
      state: search.state,
      page,
      sort,
    }));
  }, [filter.diet, search, page, sort]);

  const onColumnClick = (ev, column) => {
    const isSortedAsc = sort.key === column.fieldName && sort.order === 'asc';
    setSort({ key: column.fieldName, order: isSortedAsc ? 'desc' : 'asc' });
  };

  const getColumn = (key, fieldName, displayName, minWidth = 100, maxWidth = 200) => ({
    key,
    fieldName,
    name: displayName,
    minWidth,
    maxWidth,
    isMultiline: true,
    onRender: item => {
      return fieldName === 'name'
        ? <Link to={`/dish/${item.id}`} style={{ color: '#0078d4', textDecoration: 'none' }}>{item.name}</Link>
        : formatDishValue(item[fieldName]);
    },
    onColumnClick,
    isSorted: sort.key === fieldName,
    isSortedDescending: sort.order === 'desc',
  });

  const columns = [
    getColumn('name', 'name', 'Dish Name'),
    getColumn('prep_time', 'prep_time', 'Prep Time', 90, 120),
    getColumn('cook_time', 'cook_time', 'Cook Time'),
    {
      key: 'diet', name: 'Diet', fieldName: 'diet', minWidth: 80, maxWidth: 150,
      onRender: item => (
        <span style={{
          padding: '8px',
          backgroundColor: item.diet === 'vegetarian' ? '#c5f2c7' : '#fcdede',
          fontSize: 18,
          whiteSpace: 'normal', wordWrap: 'break-word'
        }}>
          {item.diet}
        </span>
      )
    },
    { key: 'state', name: 'State', fieldName: 'state', minWidth: 80, maxWidth: 150, onRender: item => formatDishValue(item.state) },
    { key: 'flavour', name: 'Flavour', fieldName: 'flavor_profile', minWidth: 80, maxWidth: 120, onRender: item => formatDishValue(item.flavor_profile) },
    { key: 'course', name: 'Course', fieldName: 'course', minWidth: 80, maxWidth: 120 },
    { key: 'region', name: 'Region', fieldName: 'region', minWidth: 80, maxWidth: 120, onRender: item => formatDishValue(item.region) },
  ];

  return (
    <Stack
      tokens={{ childrenGap: 16 }}
      styles={{
        root: {
          padding: 16,
          background: '#faf9f8',
          minHeight: '100vh',
          alignItems: 'center',
          width: '100%',
        }
      }}
    >
      <Stack
        tokens={{ childrenGap: 16 }}
        styles={{
          root: {
            width: '100%',
            maxWidth: 1100,
            padding: 24,
            background: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <Label styles={{ root: { fontSize: 20, fontWeight: 600 } }}>
          🍽️ Discover Dishes
        </Label>

        {/* Filter Controls */}
        <Stack
          horizontal
          wrap
          tokens={{ childrenGap: 24 }}
          styles={{
            root: {
              rowGap: 16,
              alignItems: 'flex-end',
            }
          }}
        >
          <Stack.Item styles={{ root: { width: 200 } }}>
            <Dropdown
              label="Diet"
              selectedKey={filter.diet}
              options={[
                { key: '', text: 'All' },
                { key: 'vegetarian', text: 'Vegetarian' },
                { key: 'non vegetarian', text: 'Non-Vegetarian' }
              ]}
              onChange={(_, option) => {
                setPage(1);
                setFilter(f => ({ ...f, diet: option.key }));
              }}
              styles={{
                root: { fontSize: 15 },
                label: { fontSize: 14, marginBottom: 4 },
                dropdown: { fontSize: 15, height: 32, lineHeight: '32px' },
                dropdownItem: { fontSize: 15 }
              }}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { width: 200 } }}>
            <TextField
              label="Flavor"
              placeholder="e.g. Spicy, Sweet"
              value={search.flavor}
              onChange={(_, val) => {
                setPage(1);
                setSearch(s => ({ ...s, flavor: val }));
              }}
              styles={{
                field: { fontSize: 15, height: 32 },
                label: { fontSize: 14, marginBottom: 4 }
              }}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { width: 200 } }}>
            <TextField
              label="State"
              placeholder='e.g. Punjab Assam'
              value={search.state}
              onChange={(_, val) => {
                setPage(1);
                setSearch(s => ({ ...s, state: val }));
              }}
              styles={{
                field: { fontSize: 15, height: 32 },
                label: { fontSize: 14, marginBottom: 4 }
              }}
            />
          </Stack.Item>

          <Stack.Item styles={{ root: { alignSelf: 'stretch' } }}>
            <DefaultButton
              text="Reset Filters"
              disabled={!isFilterActive}
              onClick={() => {
                localStorage.removeItem('dishFilters');
                setFilter({ diet: '' });
                setSearch({ flavor: '', state: '' });
                setSort({ key: 'name', order: 'asc' });
                setPage(1);
              }}
              styles={{
                root: {
                  height: 36,
                  fontSize: 14,
                  padding: '0 16px',
                  marginTop: 24
                }
              }}
            />
          </Stack.Item>

          {/* Right-aligned Add Dish button */}
          <Stack.Item styles={{ root: { alignSelf: 'stretch' } }}>
            <DefaultButton text="➕ Add Dish" onClick={handleAddDish} styles={{
              root: {
                height: 36,
                fontSize: 14,
                padding: '0 16px',
                marginTop: 24
              }
            }} />
          </Stack.Item>

          {showMessage && (
            <MessageBar messageBarType={2} onDismiss={() => setShowMessage(false)}>
              Please login to add a dish.
            </MessageBar>
          )}
        </Stack>
      </Stack>

      {errorMsg && (
        <MessageBar
          messageBarType={3} // Error
          isMultiline={true}
          onDismiss={() => setErrorMsg('')}
          dismissButtonAriaLabel="Close"
        >
          {errorMsg}
        </MessageBar>
      )}

      {/* Dish Table */}
      <Stack
        styles={{
          root: {
            width: '100%',
            maxWidth: 1500,
            padding: 24,
            background: '#ffffff',
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          }
        }}
      >
        <DetailsList
          items={dishes}
          columns={columns}
          styles={{
            root: {
              overflowX: 'auto',
            }
          }}
        />

        {dishes.length === 0 && (
          <span style={{ marginTop: 16, fontSize: 16, color: '#605e5c', textAlign: 'center' }}>
           No dishes found. Try adjusting your filters.
          </span>
        )}
      </Stack>

      {/* Pagination */}
      <Stack
        horizontal
        verticalAlign="center"
        horizontalAlign="center"
        tokens={{ childrenGap: 8 }}
        styles={{ root: { marginTop: 24 } }}
      >
        {/* First Page */}
        <DefaultButton
          iconProps={{ iconName: 'DoubleChevronLeft' }}
          text="First"
          disabled={page === 1}
          onClick={() => setPage(1)}
          styles={{
            root: { padding: '4px 12px', height: 36 },
            icon: { fontSize: 14 },
            label: { fontSize: 14 },
          }}
        />

        {/* Previous Page */}
        <DefaultButton
          iconProps={{ iconName: 'ChevronLeft' }}
          text="Previous"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          styles={{
            root: { padding: '4px 12px', height: 36 },
            icon: { fontSize: 14 },
            label: { fontSize: 14 },
          }}
        />

        {/* Page Info */}
        <span
          style={{
            fontWeight: 500,
            fontSize: 15,
            padding: '0 12px',
            color: '#323130',
            minWidth: 120,
            textAlign: 'center',
          }}
        >
          Page {pagination.totalPages === 0 ? 0 : page} of {pagination.totalPages}
        </span>

        {/* Next Page */}
        <DefaultButton
          text="Next"
          iconProps={{ iconName: 'ChevronRight' }}
          disabled={page >= pagination.totalPages}
          onClick={() => setPage(p => p + 1)}
          styles={{
            root: { padding: '4px 12px', height: 36 },
            icon: { fontSize: 14 },
            label: { fontSize: 14 },
          }}
        />

        {/* Last Page */}
        <DefaultButton
          text="Last"
          iconProps={{ iconName: 'DoubleChevronRight' }}
          disabled={page === pagination.totalPages}
          onClick={() => setPage(pagination.totalPages)}
          styles={{
            root: { padding: '4px 12px', height: 36 },
            icon: { fontSize: 14 },
            label: { fontSize: 14 },
          }}
        />
      </Stack>
    </Stack>
  );

};

export default DishList;

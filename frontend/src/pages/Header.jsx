import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Stack, Spinner, SpinnerSize } from '@fluentui/react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDishes } from '../services/searchService';
import { useDebounce } from '../hooks/useDebounce';

const Header = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchHeight, setSearchHeight] = useState(0);

  const navigate = useNavigate();

  const searchRef = useRef(null);

  useEffect(() => {
    if (searchRef.current) {
      const height = searchRef.current.getBoundingClientRect().height + 8; // Add some padding
      setSearchHeight(height);
    }
  }, [query]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await searchDishes(debouncedQuery);
        setSuggestions(res.data || []);
      } catch (err) {
        setSuggestions([
          {
            id: 'error',
            name:
              err.response?.status === 404
                ? 'No dishes found.'
                : err.response?.status === 500
                  ? 'Server error. Please try again later.'
                  : 'Unable to reach the server. Check your connection.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (id) => {
    navigate(`/dish/${id}`);
    setQuery('');
    setSuggestions([]);
  };

  return (
    <Stack styles={{ root: { position: 'relative', padding: 10 } }}>
      <div ref={searchRef}>
        <SearchBox
          placeholder="Search dishes, ingredients, state..."
          value={query}
          onChange={(_, newValue) => setQuery(newValue)}
          styles={{
            root: { width: 400, height: 50, borderRadius: 10, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
            field: { fontSize: 18 },
          }}
        />
      </div>

      {(suggestions.length > 0 || loading) && (
        <div
          style={{
            position: 'absolute',
            top: searchHeight,
            width: 400,
            background: 'white',
            border: '1px solid #ddd',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            borderRadius: 10,
            zIndex: 1000,
            maxHeight: 200,
            overflowY: 'auto',
          }}
        >
          {loading ? (
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <Spinner size={SpinnerSize.small} label="Loading suggestions..." />
            </div>
          ) : (
            suggestions.map((s) => (
              <div
                key={s.id}
                onClick={() => s.id !== 'error' && handleSelect(s.id)}
                style={{
                  padding: '8px 12px',
                  cursor: s.id === 'error' ? 'default' : 'pointer',
                  fontSize: 15,
                  color: s.id === 'error' ? '#a4262c' : '#0078d4',
                  textDecoration: s.id === 'error' ? 'none' : 'underline',
                  borderBottom: '1px solid #f0f0f0',
                }}
                onMouseEnter={(e) => {
                  if (s.id !== 'error') e.currentTarget.style.background = '#f3f2f1';
                }}
                onMouseLeave={(e) => {
                  if (s.id !== 'error') e.currentTarget.style.background = 'white';
                }}
              >
                {s.name}
              </div>
            ))

          )}
        </div>
      )}
    </Stack>
  );
};

export default Header;


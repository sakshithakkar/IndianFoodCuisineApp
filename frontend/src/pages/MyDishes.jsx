import { useEffect, useState } from 'react';
import { Stack, Text, DetailsList, MessageBar, Spinner, SpinnerSize } from '@fluentui/react';
import { getDishByUserId } from '../services/dishService';
import { Link } from 'react-router-dom';

const MyDishes = () => {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyDishes = async () => {
            try {
                const data = await getDishByUserId();
                setDishes(data.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    setError('Unauthorized. Please login again.');
                } else if (err.response?.status === 500) {
                    setError('Server error. Please try again later.');
                } else {
                    setError('Failed to load your dishes. Check your connection.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMyDishes();
    }, []);

    const columns = [
        {
            key: 'name',
            name: 'Name',
            fieldName: 'name',
            minWidth: 100,
            onRender: (item) => (
                <Link
                    to={`/dish/${item.id}`}
                    style={{
                        color: '#0078d4',
                        textDecoration: 'underline',
                        fontWeight: 500,
                    }}
                >
                    {item.name}
                </Link>
            ),
        },
        { key: 'ingredients', name: 'Ingredients', fieldName: 'ingredients', minWidth: 200 },
        { key: 'diet', name: 'Diet', fieldName: 'diet', minWidth: 100 },
    ];


    return (
        <Stack tokens={{ childrenGap: 16 }} styles={{ root: { padding: 24 } }}>
            <Text variant="xLarge">Your Dishes</Text>

            {loading && <Spinner label="Loading..." size={SpinnerSize.medium} />}

            {error && (
                <MessageBar messageBarType={2}>
                    {error}
                </MessageBar>
            )}

            {!loading && !error && dishes.length === 0 && (
                <Text variant="medium">You haven't added any dishes yet.</Text>
            )}

            {!loading && !error && dishes.length > 0 && (
                <DetailsList items={dishes} columns={columns} />
            )}
        </Stack>
    );
};

export default MyDishes;

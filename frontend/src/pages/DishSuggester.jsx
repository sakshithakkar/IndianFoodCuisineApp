import { useState, useEffect } from 'react';
import {
    Stack,
    Dropdown,
    PrimaryButton,
    DetailsList,
    Text,
    ComboBox
} from '@fluentui/react';
import { Link } from 'react-router-dom';
import { getAllIngredients } from '../services/ingredientService';
import { suggestDishes } from '../services/dishService';

const DishSuggester = () => {
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        return JSON.parse(localStorage.getItem('selectedIngredients')) || [];
    });

    const [suggestedDishes, setSuggestedDishes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIngredients = async () => {
            try {
                const res = await getAllIngredients();
                setAllIngredients(res.data);
            } catch (err) {
                console.error('Failed to fetch ingredients:', err);
            }
        };

        fetchIngredients();
    }, []);

    const ingredientOptions = allIngredients.map(ing => ({ key: ing, text: ing }));

    const fetchSuggestions = async () => {
        if (selectedIngredients.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const data = await suggestDishes(selectedIngredients);
            if (data.length === 0) {
                setError('No dishes found.');
            } else {
                setSuggestedDishes(data);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
                console.log(err.response?.status)
                setError('No dishes found.');
            } else if (err.response?.status === 500) {
                setError('Server error. Please try again later.');
            } else {
                setError('Could not connect to server. Please check your connection.');
            }
            setSuggestedDishes([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedIngredients.length > 0) {
            fetchSuggestions();
        }
    }, [allIngredients]);

    useEffect(() => {
        localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
    }, [selectedIngredients]);

    const columns = [
        {
            key: 'name',
            name: 'Dish Name',
            fieldName: 'name',
            onRender: item => (
                <Link to={`/dish/${item.id}`} style={{ color: '#0078d4', textDecoration: 'underline', fontWeight: 500 }}>
                    {item.name}
                </Link>
            ),
            minWidth: 120
        },
        { key: 'ingredients', name: 'Ingredients', fieldName: 'ingredients', minWidth: 300 },
        {
            key: 'diet', name: 'Diet', fieldName: 'diet', minWidth: 140,
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
        { key: 'prep_time', name: 'Prep Time', fieldName: 'prep_time', minWidth: 100 },
        { key: 'cook_time', name: 'Cook Time', fieldName: 'cook_time', minWidth: 100 },
    ];

    return (
        <Stack
            tokens={{ childrenGap: 20 }}
            styles={{
                root: {
                    padding: 32,
                    maxWidth: 1000,
                    margin: 'auto',
                    backgroundColor: '#ffffff',
                    borderRadius: 8,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                },
            }}
        >
            <Stack tokens={{ childrenGap: 4 }}>
                <Text variant="mediumPlus" styles={{ root: { color: '#605e5c' } }}>
                    Select ingredients you have and discover matching Indian dishes 🍛
                </Text>
            </Stack>

            <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 12 }}>
                <Dropdown
                    placeholder="Select ingredients"
                    label="Available Ingredients"
                    multiSelect
                    options={ingredientOptions}
                    selectedKeys={selectedIngredients}
                    onChange={(_, option) => {
                        if (option.selected) {
                            setSelectedIngredients(prev => [...prev, option.key]);
                        } else {
                            setSelectedIngredients(prev => prev.filter(item => item !== option.key));
                        }
                    }}
                    styles={{
                        dropdown: { width: 300 },
                        dropdownItemsWrapper: {
                            maxHeight: 200,
                            overflowY: 'auto',
                        },
                    }}
                />

                {/* <ComboBox
                    label="Available Ingredients"
                    placeholder="Start typing or select ingredients"
                    options={ingredientOptions}
                    multiSelect
                    allowFreeform={false} // prevents issues when typing unknown values
                    autoComplete="on"
                    selectedKeys={selectedIngredients}
                    useComboBoxAsMenuWidth
                    onChange={(_, option) => {
                        if (!option) return;

                        setSelectedIngredients(prev =>
                            option.selected
                                ? [...prev, option.key]
                                : prev.filter(key => key !== option.key)
                        );
                    }}
                    styles={{
                        container: { width: 300 },
                        optionsContainerWrapper: {
                            maxHeight: 200,
                            overflowY: 'auto',
                        },
                    }}
                /> */}

                <PrimaryButton
                    text="Suggest Dishes"
                    iconProps={{ iconName: 'Search' }}
                    onClick={fetchSuggestions}
                    disabled={selectedIngredients.length === 0}
                />

                <PrimaryButton
                    text="Clear"
                    iconProps={{ iconName: 'Clear' }}
                    onClick={() => {
                        setSelectedIngredients([]);
                        setSuggestedDishes([]);
                        setError(false)
                    }}
                    disabled={selectedIngredients.length === 0}
                    styles={{
                        root: {
                            backgroundColor: '#f3f2f1',
                            color: '#000',
                        },
                    }}
                />
            </Stack>


            {suggestedDishes.length > 0 && (
                <Stack tokens={{ childrenGap: 12 }}>
                    <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
                        Suggested Dishes ({suggestedDishes.length})
                    </Text>
                    <DetailsList items={suggestedDishes} columns={columns} />
                </Stack>
            )}

            {loading && (
                <Text variant="medium" styles={{ root: { color: '#0078d4' } }}>
                    Loading suggestions...
                </Text>
            )}

            {error && (
                <Text variant="medium" styles={{ root: { color: 'crimson' } }}>
                    {error}
                </Text>
            )}

        </Stack>
    );
};

export default DishSuggester;

import { useState, useEffect } from 'react';
import {
    Stack,
    Dropdown,
    PrimaryButton,
    CompoundButton,
    DetailsList,
    Text,
    Icon,
} from '@fluentui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { getAllIngredients } from '../services/ingredientService';

const DishSuggester = () => {
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        return JSON.parse(localStorage.getItem('selectedIngredients')) || [];
    });

    const [suggestedDishes, setSuggestedDishes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);

    useEffect(() => {
        getAllIngredients().then((res) => setAllIngredients(res.data));
    }, []);

    const ingredientOptions = allIngredients.map(ing => ({ key: ing, text: ing }));

    const fetchSuggestions = () => {
        if (selectedIngredients.length === 0) return;

        axios.post('http://localhost:3001/suggest', {
            ingredients: selectedIngredients,
        })
            .then(res => setSuggestedDishes(res.data))
            .catch(err => console.error(err));
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
        </Stack>
    );
};

export default DishSuggester;

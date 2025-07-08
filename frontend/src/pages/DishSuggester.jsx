// import { useEffect, useState } from 'react';
// import { Stack, Checkbox, Text } from '@fluentui/react';
// import { getAllIngredients } from '../services/ingredientService';
// import { suggestDishes } from '../services/dishService';

// const DishSuggester = () => {
//     const [allIngredients, setAllIngredients] = useState([]);
//     const [selected, setSelected] = useState([]);
//     const [suggestions, setSuggestions] = useState([]);

//     useEffect(() => {
//         getAllIngredients().then((res) => setAllIngredients(res.data));
//     }, []);

//     useEffect(() => {
//         if (selected.length > 0) {
//             suggestDishes(selected).then((res) => setSuggestions(res.data));
//         } else {
//             setSuggestions([]);
//         }
//     }, [selected]);

//     const toggleIngredient = (ing) => {
//         setSelected((prev) =>
//             prev.includes(ing) ? prev.filter((i) => i !== ing) : [...prev, ing]
//         );
//     };

//     return (
//         <Stack tokens={{ childrenGap: 10 }} style={{ padding: 10 }}>
//             <Text variant="xLarge">Select Available Ingredients:</Text>
//             <Stack horizontal wrap tokens={{ childrenGap: 10 }}>
//                 {allIngredients.map((ing) => (
//                     <Checkbox key={ing} label={ing} onChange={() => toggleIngredient(ing)} />
//                 ))}
//             </Stack>
//             <Text variant="large" style={{ marginTop: 20 }}>Possible Dishes:</Text>
//             <ul>
//                 {suggestions.map((dish) => (
//                     <li key={dish.name}>{dish.name}</li>
//                 ))}
//             </ul>
//         </Stack>
//     );
// };

// export default DishSuggester;

import { useState, useEffect } from 'react';
import { Stack, Dropdown, PrimaryButton, DetailsList, Text, ComboBox } from '@fluentui/react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const DishSuggester = () => {
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setSelectedIngredients] = useState([]);
    const [suggestedDishes, setSuggestedDishes] = useState([]);

    // Sample master ingredient list (ideally fetched from backend)
    const allIngredients = [
        'Rice flour', 'coconut', 'jaggery', 'banana', 'ghee',
        'salt', 'sugar', 'turmeric', 'milk', 'onion', 'garlic'
    ];

    const ingredientOptions = allIngredients.map(ing => ({ key: ing, text: ing }));

    const fetchSuggestions = () => {
        if (selectedIngredients.length === 0) return;

        axios.post('http://localhost:3001/suggest', {
            ingredients: selectedIngredients,
        })
            .then(res => setSuggestedDishes(res.data))
            .catch(err => console.error(err));
    };

    const columns = [
        {
            key: 'name', name: 'Dish Name', fieldName: 'name', onRender: item => {

                return (
                    <Link to={`/dish/${item.id}`} style={{ color: '#0078d4', textDecoration: 'none' }}>
                        {item.name}
                    </Link>
                );

            }, minWidth: 100
        },
        { key: 'ingredients', name: 'Ingredients', fieldName: 'ingredients', minWidth: 300 },
        { key: 'diet', name: 'Diet', fieldName: 'diet', minWidth: 80 },
        { key: 'prep_time', name: 'Prep Time', fieldName: 'prep_time', minWidth: 80 },
        { key: 'cook_time', name: 'Cook Time', fieldName: 'cook_time', minWidth: 80 },
    ];

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={{ root: { padding: 20 } }}>
            <Text variant="xLarge">🍲 Dish Suggester</Text>

            <Dropdown
                placeholder="Select ingredients you have"
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
            />

            <PrimaryButton
                text="Clear Selection"
                onClick={() => {
                    setSelectedIngredients([]);
                    setSuggestedDishes([]); // optional: also clear results
                }}
                disabled={selectedIngredients.length === 0}
                styles={{ root: { marginTop: 8 } }}
            />

            <PrimaryButton text="Suggest Dishes" onClick={fetchSuggestions} disabled={selectedIngredients.length === 0} />

            {suggestedDishes.length > 0 && (
                <>
                    <Text variant="large">Suggested Dishes:</Text>
                    <DetailsList items={suggestedDishes} columns={columns} />
                </>
            )}
        </Stack>
    );
};

export default DishSuggester;


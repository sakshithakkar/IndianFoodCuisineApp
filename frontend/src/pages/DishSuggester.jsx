import { useState, useEffect, useRef } from 'react';
import {
    Stack,
    PrimaryButton,
    DetailsList,
    Text,
} from '@fluentui/react';
import {
    Combobox,
    makeStyles,
    Option,
    tokens,
    useId,
} from "@fluentui/react-components";

import { Dismiss12Regular } from "@fluentui/react-icons";
import { Link } from 'react-router-dom';
import { getAllIngredients } from '../services/ingredientService';
import { suggestDishes } from '../services/dishService';

const useStyles = makeStyles({
    tagsList: {
        listStyleType: "none",
        marginBottom: '3px',
        marginTop: 0,
        paddingLeft: 0,
        display: "flex",
        flexWrap: "wrap",
        gap: tokens.spacingHorizontalXXS,
        borderRadius: '5px'
    },
    comboBox: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '2px',
        backgroundColor: '#fff',
    },
    option: {
        backgroundColor: '#f5f5f5',
        color: '#000',
        '&:hover': {
            backgroundColor: '#e0e0e0',
        },
        '&[aria-selected="true"]': {
            backgroundColor: '#cce5ff',
        },
    },
    tagPill: {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
        color: tokens.colorNeutralForeground2,
        borderRadius: '20px',
        padding: '4px 10px',
        fontSize: '14px',
        fontWeight: 500,
        border: `1px solid ${tokens.colorNeutralStroke1}`,
        gap: '4px',
        marginRight: '5px'
    },
    closeIcon: {
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: tokens.colorNeutralForeground3,
        ':hover': {
            color: tokens.colorBrandForeground1,
        },
    },
});



const DishSuggester = () => {
    const [selectedIngredients, setSelectedIngredients] = useState(() => {
        return JSON.parse(localStorage.getItem('selectedIngredients')) || [];
    });

    const [suggestedDishes, setSuggestedDishes] = useState([]);
    const [allIngredients, setAllIngredients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const styles = useStyles();

    const comboId = useId("combo-multi");
    const selectedListId = `${comboId}-selection`;
    const selectedListRef = useRef(null);
    const comboboxInputRef = useRef(null);

    const onSelect = (event, data) => {
        setSelectedIngredients(data.selectedOptions);
    };

    const onTagClick = (option, index) => {
        setSelectedIngredients(selectedIngredients.filter(o => o !== option));
        const indexToFocus = index === 0 ? 1 : index - 1;
        const optionToFocus = selectedListRef.current?.querySelector(
            `#${comboId}-remove-${indexToFocus}`
        );
        if (optionToFocus) {
            optionToFocus.focus();
        } else {
            comboboxInputRef.current?.focus();
        }
    };

    const labelledBy =
        selectedIngredients.length > 0 ? `${comboId} ${selectedListId}` : comboId;

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

    const fetchSuggestions = async () => {
        if (selectedIngredients.length === 0) return;

        setLoading(true);
        setError(null);

        try {
            const data = await suggestDishes(selectedIngredients);
            if (data.data.length === 0) {
                setError('No dishes found.');
            } else {
                setSuggestedDishes(data.data);
            }
        } catch (err) {
            console.error(err);
            if (err.response?.status === 404) {
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
            <Stack tokens={{ childrenGap: 8 }}>
                <Text variant="mediumPlus">
                    Select ingredients you have and discover matching Indian dishes.
                </Text>
            </Stack>

            <Stack horizontal verticalAlign="end" tokens={{ childrenGap: 12 }} styles={{ root: { flexWrap: 'wrap' } }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                    {selectedIngredients.length > 0 && (
                        <>
                        <p> Selected ingredients: </p>
                        <ul id={selectedListId} className={styles.tagsList} ref={selectedListRef}>
                            <span id={`${comboId}-remove`} hidden>Remove</span>
                            {selectedIngredients.map((option, i) => (
                                <li key={option}>
                                    <span className={styles.tagPill}>
                                        {option}
                                        <button
                                            onClick={() => onTagClick(option, i)}
                                            id={`${comboId}-remove-${i}`}
                                            aria-labelledby={`${comboId}-remove ${comboId}-remove-${i}`}
                                            className={styles.closeIcon}
                                        >
                                            <Dismiss12Regular />
                                        </button>
                                    </span>
                                </li>
                            ))}
                        </ul>
                        </>
                    )}

                    <Combobox
                        aria-labelledby={labelledBy}
                        multiselect={true}
                        placeholder="Select ingredients or type them"
                        selectedOptions={selectedIngredients}
                        onOptionSelect={onSelect}
                        ref={comboboxInputRef}
                        className={styles.comboBox} 
                    >
                        {allIngredients.map((option) => (
                            <Option key={option} className={styles.option}>
                                {option}
                            </Option>
                        ))}
                    </Combobox>
                </div>

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
                        setError(null);
                    }}
                    disabled={selectedIngredients.length === 0}
                    styles={{ root: { backgroundColor: '#f3f2f1', color: '#000' } }}
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

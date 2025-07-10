import { Stack, TextField, Dropdown, PrimaryButton, MessageBar } from '@fluentui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDish } from '../services/dishService';

const AddDish = () => {
    const [form, setForm] = useState({
        name: '',
        ingredients: '',
        diet: '',
        prep_time: '',
        cook_time: '',
        flavor_profile: '',
        course: '',
        state: '',
        region: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setForm(f => ({ ...f, [field]: value }));
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        const requiredFields = ['name', 'ingredients', 'diet'];
        for (const field of requiredFields) {
            if (!form[field] || form[field].trim() === '') {
                setError(`Please enter a valid value for "${field}"`);
                return;
            }
        }

        const timeFields = ['prep_time', 'cook_time'];
        for (const field of timeFields) {
            if (form[field] && (isNaN(form[field]) || Number(form[field]) < 0)) {
                setError(`"${field.replace('_', ' ')}" must be a positive number`);
                return;
            }
        }

        try {
            const response = await addDish(form);
            if (response.status === 201) {
                setSuccess('Dish added successfully!');
                setTimeout(() => navigate('/my-dishes'), 5000); // Navigate after 2s
            } else {
                setError('Unexpected server response.');
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Unauthorized: Please login again.');
            } else if (err.response?.status === 400) {
                setError('Bad request: Please check your inputs.');
            } else if (err.response?.status === 500) {
                setError('Server error. Try again later.');
            } else {
                setError('Network error. Check your connection.');
            }
        }
    };

    return (
        <Stack tokens={{ childrenGap: 15 }} styles={{ root: { maxWidth: 600, margin: 'auto' } }}>
            <h2>Add New Dish</h2>

            {error && <MessageBar messageBarType={2}>{error}</MessageBar>}
            {success && <MessageBar messageBarType={4}>{success}</MessageBar>}

            <TextField label="Dish Name" required onChange={(_, v) => handleChange('name', v)} />
            <TextField label="Ingredients" required multiline onChange={(_, v) => handleChange('ingredients', v)} />
            <Dropdown
                required
                label="Diet"
                options={[{ key: 'vegetarian', text: 'Vegetarian' }, { key: 'non vegetarian', text: 'Non-Vegetarian' }]}
                onChange={(_, opt) => handleChange('diet', opt.key)}
            />
            <TextField label="Preparation Time (min)" type="number" onChange={(_, v) => handleChange('prep_time', v)} />
            <TextField label="Cooking Time (min)" type="number" onChange={(_, v) => handleChange('cook_time', v)} />
            <TextField label="Flavor" onChange={(_, v) => handleChange('flavor_profile', v)} />
            <TextField label="Course" onChange={(_, v) => handleChange('course', v)} />
            <TextField label="State" onChange={(_, v) => handleChange('state', v)} />
            <TextField label="Region" onChange={(_, v) => handleChange('region', v)} />

            <PrimaryButton text="Submit" onClick={handleSubmit} />
        </Stack>
    );
};

export default AddDish;

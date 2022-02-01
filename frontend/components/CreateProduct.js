import useForm from '../lib/useForm';
import Form from './styles/Form'
import gql from 'graphql-tag';
import { useMutation } from '@apollo/client';
import DisplayError from './ErrorMessage';
import { ALL_PRODUCTS_QUERY } from '../pages/Products';
import Router from 'next/router'


const CREATE_PRODUCT_MUTATION = gql`
    mutation CreateProduct(
        $name : String!
        $description : String!
        $price : Int!
        $image : Upload
    ){
        createProduct(
            data: {
                name: $name
                description: $description
                price: $price
                status: "AVAILABLE"
                photo : {create : { image: $image, altText: $name}}
            }
        ){
            id
            price
            description
            name
        }
    }
`;

export default function CreateProduct() {
    const { inputs, handleChange, clearForm, resetForm } = useForm({
        name: 'Nice Shoes',
        price: 34234,
        description: 'These are the best shoes!',
    });

    const [createProduct, { loading, error, data }] = useMutation(
        CREATE_PRODUCT_MUTATION,
        {
            variables: inputs,
            refetchQueries : [{query : ALL_PRODUCTS_QUERY}]
        }
    );
    return (
        <Form onSubmit={async (e) => {
            e.preventDefault();
            console.log(inputs);
            await createProduct();
            clearForm();
            Router.push({
                pathname : `product/${data.createProduct.id}`
            })
        }}>
            <DisplayError error={error} />
            <fieldset aria-busy = {loading} disabled={loading}>
                <label htmlFor="image">
                    Image
                    <input
                        required
                        type="file"
                        id="image"
                        name="image"
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="name">
                    Name
                    <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder="Name"
                        value={inputs.name}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="price">
                    Price
                    <input
                        type="number"
                        id="price"
                        name="price"
                        placeholder="price"
                        value={inputs.price}
                        onChange={handleChange}
                    />
                </label>
                <label htmlFor="description">
                    Description
                    <textarea
                        id="description"
                        name="description"
                        placeholder="Description"
                        value={inputs.description}
                        onChange={handleChange}
                    />
                </label>

                <button type="submit">+ Add Product</button>

                {/* <button type="button" onClick={clearForm}>
                    Clear Form
                </button>
                <button type="button" onClick={resetForm}>
                    Reset Form
                </button> */}
            </fieldset>
        </Form>
    );
}
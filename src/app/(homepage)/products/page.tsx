"use client"

import { useState, useEffect } from 'react';
import axios from 'axios';

const CreateProduct = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState<Product[]>([]);


  interface Product{
    id:number; 
    name:string;
  }

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get('/api/products');
        console.log('Fetched Products:', response.data); // Check the response format
        setProducts(response.data);
        console.log('Updated products state:', response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Error fetching products');
      }
    };
    fetchProduct();
  }, []);

  useEffect(()=>{
    const fetchCategory = async()=>{
        try {
            const response = await axios.get("/api/category"); 
            setCategories(response.data); 
           
    
        } catch (error) {
            
            setError("error fetching category")
    
        }
    }
    fetchCategory(); 
        },[])
    

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Basic validation
    if (!name || !description || !price || !categoryId) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/products', {
        name,
        description,
        price: parseFloat(price), // Convert price to float
        stock: parseInt(stock) || 0, // Set stock to 0 if not provided
        categoryId,
        image: image || null, // Optional image
      });

      if (response.status === 201) {
        setSuccess('Product created successfully!');
        setName('');
        setDescription('');
        setPrice('');
        setStock('');
        setCategoryId('');
        setImage('');
      }
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error creating product. Please try again.');
      console.error('Error creating product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=' flex items-center justify-center flex-col ml-44'>
      <h1>Create New Product</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Stock (Optional):</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>

        <div>
  <label>Category:</label>
  <select
    value={categoryId}
    onChange={(e) => setCategoryId(e.target.value)}
    required
  >
    <option value="">Select a category</option>
    {categories.length > 0 ? (
      categories.map((category: any) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))
    ) : (
      <option disabled>No categories available</option>
    )}
  </select>
</div>


        <div>
          <label>Image URL (Optional):</label>
        
          <input type="file"
          onChange={(e)=>setImage(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Product'}
        </button>
      </form>

      <div>
      <h1>Product List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {products.length>0 ? (
        <ul>
          {products.map((product)=>(
            <li key={product.id}>{product.name}</li>
          ))}
        </ul>
      ):(
        <p>No product have been created</p>
      )}

    </div>


    </div>
  );
};

export default CreateProduct;

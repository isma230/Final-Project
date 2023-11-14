import React, { useState, useEffect } from 'react';
import Axios from 'axios';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { products } from '../../../_mock/products';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';



export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [openFilter, setOpenFilter] = useState(false);

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get("http://localhost:5000/v1/products" , {withCredentials:true});
        const productList = response.data;

        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("An error occurred while fetching products.");
      }
    };

    fetchProducts();
  }, []);

  // Remplacez productId par id pour correspondre à votre objet produit
  const renderProductCard = (product) => (
    <Grid key={product.id} xs={12} sm={6} md={3}>
      {/* Vous devrez peut-être ajuster les propriétés en fonction de votre objet produit réel */}
      <ProductCard product={product} />
    </Grid>
  );

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          {/* Utilisez ProductFilters ici */}
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />

          {/* Ajoutez ProductSort ici */}
          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products.map(renderProductCard)}
      </Grid>

      {/* Ajoutez ProductCartWidget ici */}
      <ProductCartWidget />
    </Container>
  );
}

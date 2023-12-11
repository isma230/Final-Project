import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { debounce } from 'lodash';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import ProductCard from '../product-card';
import ProductSort from '../product-sort';
import ProductFilters from '../product-filters';
import ProductCartWidget from '../product-cart-widget';
import { useQuery } from 'react-query';



export default function ProductsView() {
  const [error, setError] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenFilter = () => {
    setOpenFilter(true);
  };

  const handleCloseFilter = () => {
    setOpenFilter(false);
  };

  // const { data: searchProducts, isError: searchError, refetch: refetchSearch } = useQuery(
  //   ["searchProducts", searchQuery],
  //   async () => {
  //     const response = await axios.get(`http://localhost:5000/v1/products/search?query=${searchQuery}`, {
  //       withCredentials: true,
  //     });
  //     return response.data;
  //   },
  //   {
  //     enabled: !!searchQuery,
  //   }
  // );

  const { data: products, isError: fetchError, refetch: refetchProducts } = useQuery(
    ["products", searchQuery, 1],
    async () => {
      const response = await axios.get("http://localhost:5000/v1/products", {
        withCredentials: true,
        params: {
          search: searchQuery.length ? searchQuery : undefined,
          page: "1",
        }
      });
      return response.data;
    }
  );

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchButtonClick = () => {
    refetchSearch();
    refetchProducts();
  };

  if ( fetchError) {
    return <div>An error occurred while fetching products.</div>;
  }

  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <TextField
          value={searchQuery}
          onChange={handleSearchInputChange}
          label="Search by Name"
        />
        <Button onClick={handleSearchButtonClick}>Search</Button>
      </Stack>

      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">Products</Typography>
      </Stack>

      <Stack direction="row" alignItems="center" flexWrap="wrap-reverse" justifyContent="flex-end" sx={{ mb: 5 }}>
        <Stack direction="row" spacing={1} flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
          />
          <ProductSort />
        </Stack>
      </Stack>

      <Grid container spacing={3}>
        {products && products.map((product) => (
          <Grid item xs={12} sm={6} md={3} key={product._id}>
            <ProductCard product={product} />
          </Grid>
        ))}
      </Grid>

      <ProductCartWidget />
    </Container>
  );
}

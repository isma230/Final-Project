import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useParams } from "react-router-dom";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Iconify from "../../../components/iconify";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useRouter } from "../../../routes/hooks";
import { useQuery } from "react-query";

const EditProductPage = () => {
  const queryClient = useQueryClient();
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    product_name: "",
    long_description: "",
    short_description: "",
    price: "",
    discount_price: "",
    subcategory_id: "",
    options: "",
    product_image: null,
  });

  const handleChange = (e) => {
    if (e.target.name === "product_image") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const getProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/products/${id}`,
        { withCredentials: true }
      );
      const productData = response.data;
      setFormData(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      // Handle error
    }
  };

  useEffect(() => {
    console.log("ID du produit :", id); // Afficher l'ID du produit
    getProduct();
  }, [id]);

  const isFormValid = () => {
    // Add other validations if necessary
    return (
      formData.product_name &&
      formData.short_description &&
      formData.long_description &&
      formData.price &&
      formData.discount_price &&
      formData.options &&
      formData.subcategory_id &&
      formData.product_image
    );
  };

  const editProduct = async (updatedProduct) => {
    try {
      const formData = new FormData();
      Object.keys(updatedProduct).forEach((key) => {
        formData.append(key, updatedProduct[key]);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };

      const response = await axios.patch(
        `http://localhost:5000/v1/products/${id}`,
        formData,
        config
      );

      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const queryKey = "products";

  const mutation = useMutation(editProduct, {
    onSuccess: (data, variables, context) => {
      // Redirigez vers la page des produits
      router.push("/back-office/products");
    },
    onError: (error, variables, context) => {
      // Handle error
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries(queryKey);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };
  // Fetch subcategories
  const fetchSubcategories = async () => {
    const response = await axios.get("http://localhost:5000/v1/subcategories", {
      withCredentials: true,
    });
    return response.data;
  };
  const { data, isLoading, isError } = useQuery(
    "subcategories",
    fetchSubcategories
  );
  const subcategories = data?.subcategories;

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Edit Product</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              name="product_name"
              value={formData.product_name}
              onChange={handleChange}
            />
            <TextField
              label="Short Description"
              variant="outlined"
              fullWidth
              name="short_description"
              value={formData.short_description}
              onChange={handleChange}
            />
            <TextField
              label="Long Description"
              variant="outlined"
              fullWidth
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              multiline
              rows={4}
            />
            <label htmlFor="upload-button">
              {formData.product_image
                ? formData.product_image.name
                : "No file selected"}
            </label>
            <input
              hidden
              id="upload-button"
              type="file"
              name="product_image"
              onChange={handleChange}
              // value={formData.product_image}
            />
            <Button
              variant="contained"
              component="label"
              htmlFor="upload-button"
            >
              Upload Product Image
            </Button>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
            <TextField
              label="Discount Price"
              variant="outlined"
              fullWidth
              type="number"
              name="discount_price"
              value={formData.discount_price}
              onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="subcategory-label">Subcategory</InputLabel>
              <Select
                labelId="subcategory-label"
                label="Subcategory"
                name="subcategory_id"
                value={formData.subcategory_id}
                onChange={handleChange}
              >
                {isLoading ? (
                  <MenuItem>Loading...</MenuItem>
                ) : isError ? (
                  <MenuItem>Error loading subcategories</MenuItem>
                ) : (
                  subcategories.map((subcategory) => (
                    <MenuItem key={subcategory._id} value={subcategory._id}>
                      {subcategory.subcategory_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              label="Options"
              variant="outlined"
              fullWidth
              name="options"
              value={formData.options}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:edit-2-fill" />}
              //disabled={!isFormValid() || mutation.isLoading}
            >
              {mutation.isLoading ? "Updating..." : "Update Product"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default EditProductPage;

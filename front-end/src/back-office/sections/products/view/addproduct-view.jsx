import React, { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Swal from "sweetalert2";
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
// import { Button } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { useQuery } from "react-query";
import { useRouter } from "../../../routes/hooks";

const AddProductPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    product_name: "",
    long_description: "",
    short_description: "",
    price: "",
    discount_price: "",
    subcategory_id: "",
    options: "",
    product_image: null, // Ajout du champ SKU
  });

  const isFormValid = () => {
    // Ajoutez d'autres validations si nécessaire
    return (
      formData.product_name &&
      formData.short_description &&
      formData.long_description &&
      formData.price &&
      formData.discount_price &&
      formData.options &&
      formData.subcategory_id &&
      formData.product_image
      // Ajoutez d'autres validations si nécessaire
    );
  };

  const handleChange = (e) => {
    if (e.target.name === "product_image") {
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === "subcategory_id") {
      setFormData({ ...formData, subcategory_id: e.target.value });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
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

  const addProduct = async (newProduct) => {
    try {
      const formData = new FormData();
      Object.keys(newProduct).forEach((key) => {
        formData.append(key, newProduct[key]);
      });

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      };
      const response = await axios.post(
        "http://localhost:5000/v1/products",
        formData,
        config
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    handleChange(event);
  };

  const queryKey = "products";

  const mutation = useMutation(addProduct, {
    onSuccess: (data, variables, context) => {
      Swal.fire({
        title: "Success!",
        text: "Product added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/back-office/products");
      }, 1500);
    },
    onError: (error, variables, context) => {
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries(queryKey);
      setFormData({
        product_name: "",
        long_description: "",
        short_description: "",
        price: "",
        discount_price: "",
        options: "",
        product_image: null,
      });
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifiez si le produit avec le SKU donné existe déjà
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/products/${formData.sku}`,
        { withCredentials: true }
      );

      if (response.data) {
        // Si le produit existe déjà, informez l'utilisateur et arrêtez la fonction
        Swal.fire({
          title: "Error!",
          text: "Product SKU already exists",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    } catch (error) {
      // Gérez les erreurs de la requête GET
      console.error("Error fetching product:", error);
    }

    // Si le produit n'existe pas déjà, continuez avec la mutation
    mutation.mutate(formData);
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Add New Product</Typography>
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
              {selectedFile ? selectedFile.name : "No file selected"}
            </label>
            <input
              hidden
              id="upload-button"
              type="file"
              name="product_image"
              onChange={handleFileChange}
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
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!isFormValid() || mutation.isLoading}
              onClick={handleSubmit}
            >
              {mutation.isLoading ? "Adding..." : "Add Product"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default AddProductPage;

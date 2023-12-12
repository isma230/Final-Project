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

const AddCategoryPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    category_name: "",
  });

  const isFormValid = () => {
    // Check if all required fields have values
    return (
      formData.category_name    
      );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addCategorie = async (newCategorie) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/v1/categories",
        newCategorie,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const queryKey = "categories";

  const mutation = useMutation(addCategorie, {
    onSuccess: (data, variables, context) => {
      // Handle success
      Swal.fire({
        title: "Success!",
        text: "Category added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
    },
    onError: (error, variables, context) => {
      // Handle error
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
    },
    onSettled: (data, error, variables, context) => {
      // Reset loading state
      queryClient.invalidateQueries(queryKey);
      setFormData({
        category_name: ""
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <Typography variant="h4">Add New Category</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              name="category_name"
              value={formData.category_name}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!isFormValid() || mutation.isLoading}
            >
              {mutation.isLoading ? "Adding..." : "Add Category"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default AddCategoryPage;

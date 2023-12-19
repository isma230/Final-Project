import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "react-query";
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
import { useRouter } from "../../../routes/hooks";

const AddSubCategoryPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const [formData, setFormData] = useState({
    subcategory_name: "",
    category_id: "",
  });

  const { data: categories } = useQuery("categories", async () => {
    const response = await axios.get("http://localhost:5000/v1/categories");
    return response.data.categories;
  });

  const isFormValid = () => {
    // Check if all required fields have values
    return formData.subcategory_name && formData.category_id;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSubCategorie = async (newCategorie) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/v1/subcategories/create",
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

  const queryKey = "subcategories";

  const mutation = useMutation(addSubCategorie, {
    onSuccess: (data, variables, context) => {
      // Handle success
      Swal.fire({
        title: "Success!",
        text: "SubCategory added successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/back-office/subcategory");
      }, 1500);
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
        subcategory_name: "",
        category_id: "",
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
        <Typography variant="h4">Add New SubCategory</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="SubCategory Name"
              variant="outlined"
              fullWidth
              name="subcategory_name"
              value={formData.subcategory_name}
              onChange={handleChange}
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category"
              >
                {categories?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!isFormValid() || mutation.isLoading}
            >
              {mutation.isLoading ? "Adding..." : "Add SubCategory"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default AddSubCategoryPage;
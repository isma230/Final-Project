import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import Iconify from "../../../components/iconify";
import MenuItem from "@mui/material/MenuItem";
import { useParams } from "react-router-dom";
import { useRouter } from "../../../routes/hooks";

const EditSubCategoryPage = () => {
  const params = useParams();
  const subCategoryId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    subcategory_name: "",
    active: "",
    activeOptions: ["true", "false"],
  });

  const { data: subcategory, isLoading } = useQuery(["subcategory", subCategoryId], async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/subcategories/${subCategoryId}`,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  });

  useEffect(() => {
    if (subcategory) {
      setFormData({
        subcategory_name: subcategory.subcategory_name,
        active: subcategory.active,
        activeOptions: ["true", "false"],
      });
    }
  }, [subcategory]);

  const isFormValid = () => {
    return (
      formData.subcategory_name.trim() !== "" &&
      formData.active !== "" 
    );
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateSubCategory = async (updatedSubCategory) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/subcategories/${subCategoryId}`,
        updatedSubCategory,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const mutation = useMutation(updateSubCategory, {
    onSuccess: (data, variables, context) => {
      Swal.fire({
        title: "Success!",
        text: "Subcategory updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/back-office/subcategory");
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
      queryClient.invalidateQueries(["subcategory", subCategoryId]);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Edit Subcategory</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="Subcategory Name"
              variant="outlined"
              fullWidth
              name="subcategory_name"
              value={formData.subcategory_name}
              onChange={handleChange}
            />
            <TextField
              label="Active Status"
              variant="outlined"
              fullWidth
              name="active"
              select
              value={formData.active}
              onChange={handleChange}
            >
                {formData.activeOptions.map((active) => (
                    <MenuItem key={active} value={active}>
                    {active}
                    </MenuItem>
                ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:save-fill" />}
              disabled={!isFormValid() || mutation.isLoading}    
            >
              {mutation.isLoading ? "Updating..." : "Update Subcategory"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default EditSubCategoryPage;
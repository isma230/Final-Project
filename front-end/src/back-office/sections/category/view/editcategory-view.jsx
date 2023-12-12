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
import {useRouter} from "../../../routes/hooks";

const EditCategoryPage = () => {
    const params = useParams();
    const userId = params.id;
    const router = useRouter();
   const queryClient = useQueryClient();

   const [formData, setFormData] = useState({
    category_name: "",
    active: "",
    activeOptions: ["true", "false"],
  });

  const { data: user, isLoading } = useQuery(["user", userId], async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/categories/${userId}`,
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
    if (user) {
      setFormData({
        category_name: user.category_name,
        active: user.active,
        activeOptions: ["true", "false"],
      });
    }
  }, [user]);

  const isFormValid = () => {
    return (
      formData.category_name.trim() !== "" &&
      formData.active !== "" 
    );
  };
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/categories/${userId}`,
        updatedUser,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const mutation = useMutation(updateUser, {
    onSuccess: (data, variables, context) => {
      Swal.fire({
        title: "Success!",
        text: "Category updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/category");
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
      queryClient.invalidateQueries(["user", userId]);
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
        <Typography variant="h4">Edit Categorie</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="Categorie Name"
              variant="outlined"
              fullWidth
              name="categorie_name"
              value={formData.category_name}
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
              {mutation.isLoading ? "Updating..." : "Update Category"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default EditCategoryPage;

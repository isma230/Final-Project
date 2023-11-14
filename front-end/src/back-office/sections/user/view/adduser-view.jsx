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

const AddUserPage = () => {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    user_name: "",
    password: "",
    roleOptions: ["Admin", "Manager"],
  });

  const isFormValid = () => {
    // Check if all required fields have values
    return (
      formData.first_name &&
      formData.last_name &&
      formData.email &&
      formData.role &&
      formData.user_name &&
      formData.password
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addUser = async (newUser) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json"
          },
          withCredentials: true
        }
      const response = await axios.post(
        "http://127.0.0.1:5000/v1/users/create-user",
        newUser,
        config
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const queryKey = "users";

  const mutation = useMutation(addUser, {
    onSuccess: (data, variables, context) => {
      // Handle success
      Swal.fire({
        title: "Success!",
        text: "User added successfully!",
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
        first_name: "",
        last_name: "",
        email: "",
        role: "",
        user_name: "",
        password: "",
        roleOptions: formData.roleOptions,
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
        <Typography variant="h4">Add New User</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="First Name"
              variant="outlined"
              fullWidth
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              variant="outlined"
              fullWidth
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
            />
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              name="user_name"
              value={formData.user_name}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            <FormControl variant="outlined" fullWidth>
              <InputLabel htmlFor="role">Role</InputLabel>
              <Select
                label="Role"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                {formData.roleOptions.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:plus-fill" />}
              disabled={!isFormValid() || mutation.isLoading}
            >
              {mutation.isLoading ? "Adding..." : "Add User"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default AddUserPage;

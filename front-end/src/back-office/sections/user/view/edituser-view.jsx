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

const EditUserPage = () => {
    const params = useParams();
    const userId = params.id;
    const router = useRouter();
   const queryClient = useQueryClient();

   const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "",
    user_name: "",
    active: "",
    password: "",
    roleOptions: ["Admin", "Manager"],
    activeOptions: ["true", "false"],
  });

  const { data: user, isLoading } = useQuery(["user", userId], async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/users/details/${userId}`,
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
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
        user_name: user.user_name,
        active: user.active,
        password: user.password,
        roleOptions: ["Admin", "Manager"],
        activeOptions: ["true", "false"],
      });
    }
  }, [user]);

  const isFormValid = () => {
    return (
      formData.first_name.trim() !== "" &&
      formData.last_name.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.role.trim() !== "" &&
      formData.user_name.trim() !== "" &&
      formData.password.trim() !== "" 
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateUser = async (updatedUser) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/users/${userId}`,
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
        text: "User updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/back-office/user");
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
        <Typography variant="h4">Edit User</Typography>
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
            <TextField
              label="Role"
              variant="outlined"
              fullWidth
              name="role"
              select
              value={formData.role}
              onChange={handleChange}
            >
              {formData.roleOptions.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
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
            <TextField
              label="Password"
              variant="outlined"
              fullWidth
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:save-fill" />}
              disabled={!isFormValid() || mutation.isLoading}    
            >
              {mutation.isLoading ? "Updating..." : "Update User"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default EditUserPage;

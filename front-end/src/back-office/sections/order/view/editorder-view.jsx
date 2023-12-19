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

const EditOrderPage = () => {
  const params = useParams();
  const orderId = params.id;
  const router = useRouter();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    status: "",
    orderOptions: ['Open', 'Shipped', 'Paid', 'Closed', 'Canceled'],
  });

  const { data: order, isLoading } = useQuery(["order", orderId], async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/orders/${orderId}`,
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
    if (order) {
      setFormData({
        ...formData,
        status: order.status,
      });
    }
  }, [order]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updateOrder = async (updatedOrder) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/v1/orders/${orderId}`,
        updatedOrder,
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data.message;
    }
  };

  const mutation = useMutation(updateOrder, {
    onSuccess: (data, variables, context) => {
      Swal.fire({
        title: "Success!",
        text: "Order updated successfully!",
        icon: "success",
        confirmButtonText: "OK",
      });
      setTimeout(() => {
        router.push("/back-office/orders");
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
      queryClient.invalidateQueries(["order", orderId]);
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
        <Typography variant="h4">Edit Order</Typography>
      </Stack>

      <Card>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={5}>
            <TextField
              label="Status"
              variant="outlined"
              fullWidth
              name="status"
              value={formData.status}
              onChange={handleChange}
              select
            >
              {formData.orderOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="eva:save-fill" />}
            >
              {mutation.isLoading ? "Updating..." : "Update User"}
            </Button>
          </Stack>
        </form>
      </Card>
    </Container>
  );
};

export default EditOrderPage;

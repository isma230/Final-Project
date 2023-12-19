import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "../../../components/scrollbar";
import OrderTableHead from "../order-table-head";
import OrderTableRow from "../order-table-row";
import OrderTableToolbar from "../order-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { Link } from "react-router-dom";
import { useRouter } from "../../../routes/hooks";
import TableNoData from "../table-no-data";
import Iconify from "../../../components/iconify";

const OrderPage = () => {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("order_date");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const router = useRouter();

  const { data: orders, isLoading, refetch } = useQuery("orders", async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/orders/list?query=${filterName}&page=${
          page + 1
        }&limit=${rowsPerPage}&sort=${order.toUpperCase()}`,
        {
          withCredentials: true,
        }
      );
      return response.data.orders;
    } catch (error) {
      throw error;
    }
  });

  useEffect(() => {
    refetch();
  }, [page, rowsPerPage, order, filterName]);

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === "asc";
    if (id !== "") {
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((order) => order._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const isCheckbox = event.target.type === "checkbox";

    if (!isCheckbox) {
      event.stopPropagation(); // Prevent row selection when clicking on elements other than the checkbox
    }

    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };


  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: orders || [],
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleEditOrder = () => {
    if (selected.length !== 1) {
      Swal.fire("Error", "Please select only one user to edit.", "error");
    } else {
      router.push(`/back-office/orders/editorder/${selected[0]}`);
    }
    setSelected([]);
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Orders</Typography>
      </Stack>

      <Card>
        <OrderTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          handleEditOrder={handleEditOrder}
        />

        <Scrollbar>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer sx={{ overflow: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <OrderTableHead
                  order={order}
                  orderBy={orderBy}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "customerFirstName", label: "customer First Name" },
                    { id: "customerLastName", label: "customer Last Name" },
                    { id: "status", label: "Status" },
                    { id: "itemsTotal", label: "Items Total" },
                    { id: "total_price", label: "Total Price" },
                    { id: "order_date", label: "Order Date" },
                  ]}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <OrderTableRow
                      key={row._id}
                      id={row._id}
                      customerFirstName={row.customerFirstName}
                      customerLastName={row.customerLastName}
                      orderDate={
                        row.order_date
                          ? new Date(row.order_date).toLocaleDateString()
                          : "N/A"
                      }
                      itemsTotal={row.itemsTotal}
                      totalPrice={row.cart_total_price}
                      status={row.status}
                      selected={selected.indexOf(row._id) !== -1}
                      handleClick={(event) => handleClick(event, row._id)}
                    />
                  ))}
                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>

      </Card>
    </Container>
  );
};

export default OrderPage;

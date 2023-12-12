import { useState, useEffect } from "react";
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

import Iconify from "../../../components/iconify";
import Scrollbar from "../../../components/scrollbar";

import TableNoData from "../table-no-data";
import UserTableRow from "../user-table-row";
import UserTableHead from "../user-table-head";
import TableEmptyRows from "../table-empty-rows";
import UserTableToolbar from "../user-table-toolbar";
import { emptyRows, applyFilter, getComparator } from "../utils";
import { Link } from "react-router-dom";
import { useRouter } from "../../../routes/hooks";
export default function CustomerPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("creation_date");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const router = useRouter();

  const {
    data: customers,
    isLoading,
    refetch,
  } = useQuery("customers", async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/customers?query=${filterName}&page=${
          page + 1
        }&limit=${rowsPerPage}&sort=${order.toUpperCase()}`,
        {
          withCredentials: true,
        }
      );
      setTotalCustomers(response.data.totalCustomers);
      return response.data.customers;
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
      const newSelecteds = customers.map((cus) => cus._id);
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

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    console.log(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const dataFiltered = applyFilter({
    inputData: customers || [], // Handle the case when users is null or undefined
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;



  const handleEditUser = () => {
    if (selected.length !== 1) {
      Swal.fire("Error", "Please select only one customer to edit.", "error");
    } else {
      router.push(`/back-office/customer/editcustomer/${selected[0]}`);
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
        <Typography variant="h4">Customers</Typography>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          handleEditUser={handleEditUser}
        />

        <Scrollbar>
          {isLoading ? (
            <Typography>Loading...</Typography>
          ) : (
            <TableContainer sx={{ overflow: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={totalCustomers}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "first_name", label: "First Name" },
                    { id: "last_name", label: "Last Name" },
                    { id: "email", label: "Email" },
                    { id: "active", label: "Status" },
                    { id: "valid_account", label: "Valid Account" },
                    { id: "last_login", label: "Last Login" },
                    { id: "creation_date", label: "Created Date" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        id={row._id} // Pass the user ID as "id" prop
                        firstname={row.first_name}
                        lastname={row.last_name}
                        email={row.email}
                        active={row.active}
                        validAccount={row.valid_account}
                        lastLogin={
                          row.last_login
                            ? new Date(row.last_login).toLocaleDateString()
                            : "N/A"
                        }
                        creationDate={new Date(
                          row.creation_date
                        ).toLocaleDateString()}
                        selected={selected.indexOf(row._id) !== -1}
                        handleClick={(event) => handleClick(event, row._id)}
                      />
                    ))}
                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage)}
                  />
                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>

        <TablePagination
          page={page}
          component="div"
          rowsPerPage={rowsPerPage}
          count={filterName ? dataFiltered.length : totalCustomers}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

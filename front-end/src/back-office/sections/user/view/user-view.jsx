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
import { bg } from "date-fns/esm/locale";
export default function UserPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("creation_date");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const router = useRouter();

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery("users", async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/users?query=${filterName}&page=${
          page + 1
        }&limit=${rowsPerPage}&sort=${order.toUpperCase()}`,
        {
          withCredentials: true,
        }
      );
      setTotalUsers(response.data.totalUsers);
      return response.data.users;
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
      const newSelecteds = users.map((user) => user._id);
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
    inputData: users || [], // Handle the case when users is null or undefined
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleDelete = async () => {
    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover the selected user(s)!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel",
      reverseButtons: true,
    });

    // If the user clicks "Yes, delete it!"
    if (result.isConfirmed) {
      try {
        // Delete the selected user(s)
        for (const id of selected) {
          await axios.delete(`http://localhost:5000/v1/users/${id}`, {
            withCredentials: true,
          });
        }
        // Show success message
        Swal.fire(
          "Deleted!",
          "The selected user(s) has been deleted.",
          "success"
        );
        refetch();
        // Clear the selected array
        setSelected([]);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response.data.message || "Something went wrong!",
          "error"
        );
      }
    }
  };

  const handleEditUser = () => {
    if (selected.length !== 1) {
      Swal.fire("Error", "Please select only one user to edit.", "error");
    } else {
      router.push(`/back-office/user/edituser/${selected[0]}`);
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
        <Typography variant="h4">Users</Typography>
        <Link to="/back-office/user/adduser">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New User
          </Button>
        </Link>
      </Stack>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
          onDelete={handleDelete}
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
                  rowCount={totalUsers}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "user_name", label: "User Name" },
                    { id: "first_name", label: "First Name" },
                    { id: "last_name", label: "Last Name" },
                    { id: "email", label: "Email" },
                    { id: "role", label: "Role" },
                    { id: "active", label: "Status" },
                    { id: "last_update", label: "Last Updated" },
                    { id: "last_login", label: "Last Login" },
                    { id: "creation_date", label: "Created Date" },
                  ]}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <UserTableRow
                      key={row._id}
                      id={row._id} // Pass the user ID as "id" prop
                      name={row.user_name}
                      firstname={row.first_name}
                      lastname={row.last_name}
                      role={row.role}
                      email={row.email}
                      active={row.active}
                      lastUpdate={
                        row.last_update
                          ? new Date(row.last_update).toLocaleDateString()
                          : "N/A"
                      }
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
          count={filterName ? dataFiltered.length : totalUsers}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

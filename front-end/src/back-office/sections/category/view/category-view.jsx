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
export default function CategoryPage() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState("asc");
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState("creation_date");
  const [filterName, setFilterName] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCategories, setTotalCategories] = useState(0);
  const router = useRouter();

  const {
    data: categories,
    isLoading,
    refetch,
  } = useQuery("customers", async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/v1/categories?query=${filterName}&page=${
          page + 1
        }&limit=${rowsPerPage}&sort=${order.toUpperCase()}`,
        {
          withCredentials: true,
        }
      );
      setTotalCategories(response.data.totalCategories);
      return response.data.categories;
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
      const newSelecteds = categories.map((cat) => cat._id);
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
    inputData: categories || [], // Handle the case when users is null or undefined
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;



  const handleEditUser = () => {
    if (selected.length !== 1) {
      Swal.fire("Error", "Please select only one category to edit.", "error");
    } else {
      router.push(`/back-office/category/editcategory/${selected[0]}`);
    }
    setSelected([]);
  };

  const handleDelete = async () => {
    // Show SweetAlert confirmation
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover the selected category(s)!",
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
          await axios.delete(`http://localhost:5000/v1/categories/${id}`, {
            withCredentials: true,
          });
        }
        // Show success message
        Swal.fire(
          "Deleted!",
          "The selected category(s) has been deleted.",
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

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Categories</Typography>
        <Link to="/back-office/category/addcategory">
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            New Category
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
                  rowCount={totalCategories}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    { id: "category_name", label: "Category Name" },
                    { id: "active", label: "Status" },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .map((row) => (
                      <UserTableRow
                        key={row._id}
                        id={row._id} // Pass the user ID as "id" prop
                        categoriename={row.category_name}
                        active={row.active}
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
          count={filterName ? dataFiltered.length : totalCategories}
          onPageChange={handleChangePage}
          rowsPerPageOptions={[10, 25, 50, 100]}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

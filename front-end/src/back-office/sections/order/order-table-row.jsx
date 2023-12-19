import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Popover from "@mui/material/Popover";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import { Button } from "@mui/material";
import { useRouter } from "../../routes/hooks";
import { Chip } from "@mui/material";
import Label from "../../components/label";
import Iconify from "../../components/iconify";

// ----------------------------------------------------------------------

export default function UserTableRow({
  id,
  selected: externalSelected,
  orderDate,
  customerFirstName,
  customerLastName,
  itemsTotal,
  totalPrice,
  status,
  handleClick,
}) {
  const [internalSelected, setInternalSelected] = useState(false);

  // Update internal selected state when the external selected prop changes
  useEffect(() => {
    setInternalSelected(externalSelected);
  }, [externalSelected]);
  const [open, setOpen] = useState(null);
  let color;

  if (status === "Open") {
    color = "primary";
  } else if (status === "Shipped") {
    color = "info";
  } else if (status === "Paid") {
    color = "success";
  } else if (status === "Closed") {
    color = "warning";
  } else if (status === "Canceled") {
    color = "error";
  }

  return (
    <>
      <TableRow
        hover
        onClick={(event) => handleClick(event, id)}
        role="checkbox"
        aria-checked={internalSelected}
        tabIndex={-1}
        key={id}
        selected={internalSelected}
      >
        <TableCell padding="checkbox">
          <Checkbox
            disableRipple
            checked={internalSelected}
            onChange={(event) => {
              setInternalSelected(event.target.checked);
              handleClick(event, id);
            }}
            onClick={(event) => event.stopPropagation()} // Stop propagation for checkbox clicks
          />
        </TableCell>
        <TableCell >
          <Stack >
            <Typography variant="subtitle2" noWrap>
              {customerFirstName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell >
          <Stack >
            <Typography variant="subtitle2" noWrap>
              {customerLastName}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell >
        <Chip label={status} color={color} />
        </TableCell>
        <TableCell>{itemsTotal}</TableCell>
        <TableCell>{totalPrice}</TableCell>
        <TableCell>{orderDate}</TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  orderDate: PropTypes.string.isRequired,
  customer: PropTypes.string.isRequired,
  totalPrice: PropTypes.number.isRequired,
  status: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

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
  subcategoryname,
  active,
  handleClick,
}) {
  const [internalSelected, setInternalSelected] = useState(false);

  // Update internal selected state when the external selected prop changes
  useEffect(() => {
    setInternalSelected(externalSelected);
  }, [externalSelected]);
  const [open, setOpen] = useState(null);

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
              <TableCell>
              <Typography variant="subtitle2" noWrap>
          {subcategoryname}
              </Typography>
              </TableCell>
        <TableCell align="left"  >
          {active ? (
            <Chip label="Active" color="success" />
          ) : (
            <Chip label="Inactive" color="error" />
          )}
        </TableCell>
      </TableRow>
    </>
  );
}

UserTableRow.propTypes = {
  id: PropTypes.string.isRequired,
  subcategoryname: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  selected: PropTypes.bool.isRequired,
  handleClick: PropTypes.func.isRequired,
};

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "../../../routes/hooks";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import Popover from "@mui/material/Popover";
import { alpha } from "@mui/material/styles";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const router = useRouter();
  const [account, setAccount] = useState({
    username: "",
    email: "",
    role: "",
    active: "",
  });

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      // Update your 'account' state or relevant state with storedUser
      setAccount(storedUser);
    }
  }, []);

  const MENU_OPTIONS = [
    {
      label: account.email,
      icon: "eva:person-fill",
    },
    {
      label: account.active == true ? "Active" : "Inactive",
    },
  ];

  const handleLogout = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/v1/users/logout",
        {
          withCredentials: true,
        }
      );
      localStorage.removeItem("user");
      router.push("/back-office/login");
    } catch (error) {
      console.log(error);
    }
  };
  const Close = () => {
    setOpen(null);
  };
  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src="/assets/images/avatars/avatar_25.jpg"
          alt="photoURL"
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        ></Avatar>
      </IconButton>

      <Popover
        open={!!open}
        anchorEl={open}
        onClose={Close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1,
            ml: 0.75,
            width: 200,
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2 }}>
          <Typography variant="subtitle2" noWrap>
            {account.username}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {account.role}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {MENU_OPTIONS.map((option) => (
          <MenuItem key={option.label}>{option.label}</MenuItem>
        ))}

        <Divider sx={{ borderStyle: "dashed", m: 0 }} />

        <MenuItem
          disableRipple
          disableTouchRipple
          onClick={handleLogout}
          sx={{ typography: "body2", color: "error.main", py: 1.5 }}
        >
          Logout
        </MenuItem>
      </Popover>
    </>
  );
}

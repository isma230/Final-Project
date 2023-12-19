import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

export default function TableNoData({ query }) {
  return (
    <TableRow sx={{alignItems:"center",}}>
      <TableCell align="center" colSpan={12} sx={{ py: 3  }}>
        <Paper
          sx={{
            p: 1,
            bgcolor: 'background.neutral',
            boxShadow: (theme) => theme.customShadows.z8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" paragraph align="center">
            Not found
          </Typography>

          <Typography variant="body2" align="center">
            No results found for &nbsp;
            <strong>&quot;{query}&quot;</strong>.
            <br /> Try checking for typos or using complete words.
          </Typography>
        </Paper>
      </TableCell>
    </TableRow>
  );
}

TableNoData.propTypes = {
  query: PropTypes.string,
};
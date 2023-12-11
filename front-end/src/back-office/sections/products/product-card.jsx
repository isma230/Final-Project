import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { fCurrency } from '../../utils/format-number';
import { Link } from 'react-router-dom';
import Label from '../../components/label';
import { ColorPreview } from '../../components/color-utils';
import axios from 'axios';
import { useQueryClient } from 'react-query'; 

export default function ShopProductCard({ product }) {
  console.log("Produit :", product);
  const renderStatus = product.status && (
    <Label
      variant="filled"
      color={(product.status === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {product.status}
    </Label>
  );

  const renderImg = product.product_image && (
    <Box
      component="img"
      alt={product.name}
      src={"http://localhost:5000/uploads/" + product.product_image.split("\\").at(-1)}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );
  const queryClient = useQueryClient();
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`http://localhost:5000/v1/products/${_id}`, {
        withCredentials: true,
        // Ajouter d'autres headers au besoin (par exemple, le token d'authentification)
      });
  
      // Invalider et refaire la requête pour obtenir la liste des produits
      queryClient.invalidateQueries('products');
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error);
    }
  };

  const renderPrice = (
    <Typography variant="subtitle1">
      {fCurrency(product.price)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Typography color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.product_name}
        </Typography>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          {product.colors && <ColorPreview colors={product.colors} />}
          {renderPrice}
        </Stack>


        <Typography variant="body2">{product.short_description}</Typography>

        <Typography variant="body2">{product.long_description}</Typography>

        {/* Boutons d'ajout et de suppression */}
        <Stack direction="row" spacing={2}>
          <Link to={`/products/editproduct/${product._id}`}>
            <Button variant="contained" color="primary">
              Edit
            </Button>
          </Link>
          <Button variant="contained" color="error" onClick={() => handleDelete(product._id)}>
            Delete
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.shape({
    status: PropTypes.string,
    product_image: PropTypes.string,
    name: PropTypes.string,
    price: PropTypes.number,
    discount_price: PropTypes.number,
    colors: PropTypes.arrayOf(PropTypes.string),
    short_description: PropTypes.string,
    long_description: PropTypes.string,
    // Ajoutez d'autres propriétés du produit ici
  }),
};

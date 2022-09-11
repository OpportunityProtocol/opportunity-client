import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    MenuItem,
    InputBase,
    Select,
    FormControl,
    SelectChangeEvent
} from '@mui/material'

const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #ced4da',
    fontSize: 14,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
}));

export default function CustomizedSelects() {
  const [age, setAge] = React.useState(0);
  const handleChange = (event: SelectChangeEvent<number>, child: React.ReactNode) => {
    setAge(Number(event.target.value));
  };
  return (
    <div>
      <FormControl sx={{ m: 1, minWidth: 220 }} variant="standard">
        <Select
          id="demo-customized-select-native"
          value={age}
          fullWidth
          onChange={handleChange}
          input={<BootstrapInput fullWidth placeholder='Recently created' />}
          label='Recently created'
          placeholder='Recently created'
          defaultValue={age}
          size='small'
        >
  <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={0}>Recently Created</MenuItem>
        <MenuItem value={1}>Top Rated</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

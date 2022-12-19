import * as React from 'react';
import { styled } from '@mui/material/styles';
import { InputLabel, MenuItem, FormControl, NativeSelect, InputBase } from '@mui/material';

import { FunctionComponent } from 'react';

interface ISelectProps {
  id: string;
  label?: string;
  placeholder: string;
  width?: number;
  options?: Array<JSX.Element>;
  onShowCustomContent?: React.MouseEventHandler;
  isCustomContent?: boolean;
  CustomContentComponent?: React.ReactElement;
}

const SelectInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #eee',
    fontSize: 16,
    height: 20,
    padding: '10px 26px 15px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '&:focus': {
      borderRadius: 4,
      borderColor: '#4CAF50',
      boxShadow: '0px 6px 15px -3px rgba(0,0,0,0.1)',
    },
  },
}));

const Select: FunctionComponent<ISelectProps> = ({
  id,
  label,
  placeholder,
  width,
  options = [],
}) => {
  const [value, setValue] = React.useState('');

  const handleChange = (event: { target: { value: string } }) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <FormControl variant="standard">
        <NativeSelect
          id={id}
          value={value}
          onChange={handleChange}
          input={<SelectInput />}
          sx={{ width }}
        >
          <option aria-label="None" value="">
            {placeholder}
          </option>
          {options.map((option) => option)}
        </NativeSelect>
      </FormControl>
    </div>
  );
};

export default Select;

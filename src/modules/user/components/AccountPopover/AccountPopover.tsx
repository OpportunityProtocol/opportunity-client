import * as React from 'react';
import Popover from '@mui/material/Popover';

interface IAccountPopoverProps {
    open: boolean
}

const AccountPopover : React.FunctionComponent<IAccountPopoverProps> = ({ open }) => {
    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Popover 

        id='account-popover'
        open={true}
      
        onClose={handleClose}
        anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
        }}
        >
            The content of the Popover.
        </Popover>
    )
}

export default AccountPopover
import { makeStyles } from "@mui/styles";
import { alpha } from "@mui/system";

const useStyles = makeStyles(theme => ({
    card: {
        display: 'flex',
        alignItems: 'center',
        padding: 10,
        width: '100%',
        border: 'none'
    },
    blockie: {
        borderRadius: 20
    },
}))

export { useStyles }
import { makeStyles } from "@mui/styles";
import { alpha } from "@mui/system";

const useStyles = makeStyles(theme => ({
    root: {
        width: 'auto',
        padding: 10,
        margin: '5px 0px',
        borderWidth: 1,
        borderColor: '#eee',

    },
    blockie: {
        borderRadius: 20
    },
    descriptionContainer: {
        minHeight: 100,
        padding: '10px 0px'
    },
    description: {
        maxHeight: 1,
        fontWeight: '700'
    },
    chipTag: {
        color: theme.palette.primary.light,
        fontSize: 8,
        marginRight: '5px'
    },
    employerName: {
        fontSize: 14
    },
    relationshipTitle: {
        fontSize: 17,
        fontWeight: '700'
    },
    dateCreated: {
        fontSize: 12,
        color: 'rgb(159, 159, 159)'
    },
    row: {
        display: 'flex',
        alignItems: 'center'
    }
}))

export { useStyles }
import { makeStyles } from "@mui/styles";
import { alpha } from "@mui/system";

const useStyles = makeStyles(theme => ({
    card: { 
        height: 'auto',
       // border: 'none !important',
        '&:hover': {
           // boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
            cursor: 'pointer',
            backgroundColor: '#eee'
        },
        position: 'relative', 
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1)
    },
    purchaseIconSmall: {
        color: 'red'
    },
    suggestedContainer: {
        position: 'relative', 
        top: 20, 
        left: 15
    },
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
    },
    viewButton: {
        visibility: 'hidden',
        '&:hover': {
            visibility: 'visible'
        },
    },
    tagChip: {
        fontSize: 11,
        backgroundColor: '#eee',
        borderRadius: 1,
        border: 'none',
    },
    divider: {
        paddingTop: theme.spacing(5)
    }
}))

export { useStyles }
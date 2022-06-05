import { makeStyles } from "@mui/styles";
import { alpha } from "@mui/system";
import { Theme } from '@mui/material'

const useStyles = makeStyles((theme: Theme) => ({
    card: {
        height: 'auto',
        '&:hover': {
            boxShadow: '0px 6px 6px -3px #ccc, 0px 10px 14px 1px #ccc, 0px 4px 18px 3px #ccc',
            cursor: 'pointer',
            //  backgroundColor: '#eee'
        },
        position: 'relative',
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
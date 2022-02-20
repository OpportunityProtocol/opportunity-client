import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
        marginTop: '4%',
    },
    selectedCard: {
        border: '5px solid #A5D6A7'
    },
    cardContent: {
        padding: 15
    },
    marketTypeCard: {
        width: 220,
        height: 180,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textField: {
        width: 400,
        border: '1px solid #eee',
        backgroundColor: '#fafafa',
    },
    sectionHeader: {
        fontSize: 20,
        fontWeight: 'medium'
    },
    sectionSubheader: {
        fontSize: 13,
        fontWeight: 'regular',
        color: '#212121'
    },
    subSectionHeader: {
        fontWeight: '600',
        color: 'rgba(33, 33, 33, .85)',
        fontSize: 15
    },
    columnCenter: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    }
  }),
);

export { useStyles }
import { createStyles, makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) =>
    createStyles({
        container: {
            marginTop: '4%',
        },
        boxContainer: {
            padding: '1% 3%', height: 'calc(100vh - 120px)', backgroundColor: '#fafafa'
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
        },
        blockie: {
            borderRadius: 20
        },
        chatArea: {
            width: '100%', height: '100%', borderRadius: 10,
        },
        inputContainer: {
            display: 'flex', bgcolor: '#fafafa'
        },
        inputBase: {
            width: '100%', padding: 1
        },
        containerCentered: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        fileContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        link: {
            color: 'rgb(54, 119, 74)',
            cursor: 'pointer'
        },
        tableCell: {
            borderBottomWidth: 0,
            borderBottom: 'none'
        },
        tableRow: {
            background: theme.palette.background.card,
            borderRadius: 8
        },
        tableCellText: {
            color: 'grey'
        },
        submitButton: {
            marginBottom: 2,
            borderRadius: 0
        },
        mainContainer: {
            mt: 5,
            bgcolor: '#fafafa'
        },
        deliverableItem: {
            padding: '0px !important',
            margin: '0px !important'
        }
    }),
);

export { useStyles }
export default ''
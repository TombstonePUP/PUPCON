import { Exhibits } from '@/types/exhibits';
import DeleteExhibit from './delete-exhibit-dialog';
import ExhibitDialog from './exhibit-dialog';

interface ExhibitDialogProps {
    type: 'add' | 'edit' | 'delete' | null;
    exhibit?: Exhibits | null;
    onClose: () => void;
}

export function RenderExhibitDialog({ type, exhibit, onClose }: ExhibitDialogProps) {
    switch (type) {
        case 'add':
            return <ExhibitDialog type={type} onClose={onClose} />;
        case 'edit':
            return <ExhibitDialog type={type} exhibit={exhibit} onClose={onClose} />;
        case 'delete':
            return <DeleteExhibit exhibit={exhibit} onClose={onClose} />;
        case null:
            break;
        default:
            return null;
    }
}

import { FilesOverview } from '@/types';
import ApproveRequest from './approve-document';
import RejectRequest from './reject-document';
import RevertRequest from './revert-document';

interface RequestDialogProps {
    type: 'reject' | 'revert' | 'approve' | null;
    file: FilesOverview[];
    onClose: () => void;
}

export default function RenderRequestDialog({ type, file, onClose }: RequestDialogProps) {
    switch (type) {
        case 'reject':
            return <RejectRequest file={file} onClose={onClose} />;
        case 'revert':
            return <RevertRequest file={file} onClose={onClose} />;
        case 'approve':
            return <ApproveRequest file={file} onClose={onClose} />;
        default:
            return null;
    }
}

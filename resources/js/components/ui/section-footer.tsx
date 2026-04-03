import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Eye, Save } from 'lucide-react';
import React from 'react';

interface SectionFooterProps {
  onSave: () => void;
  onPreview: (() => void) | null;
  previewDescription?: string;
  previewUrl?: string;
}

const SectionFooter: React.FC<SectionFooterProps> = ({
  onSave,
  onPreview,
  previewDescription = 'Easily view your changes on the site.',
  previewUrl,
}) => {
  return (
    <div className="rounded-b-lg border-t border-border bg-muted/50 px-8 py-4">
      <div className="flex items-center justify-end gap-3">
        {onPreview && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Eye className="h-4 w-4" />
                View
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-lg font-medium text-foreground">View Content</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {previewDescription}
                </DialogDescription>
              </DialogHeader>
              <div className="my-0 rounded-md border border-warning-border bg-warning p-4">
                <p className="text-sm text-warning-foreground">
                  <span className="mb-1 block font-semibold text-warning-foreground">Note: Redirecting page!</span>
                  This will open a new tab and take you to the section you edited.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    variant="noborder"
                    onClick={() => {
                      if (previewUrl) window.open(previewUrl, '_blank');
                      else onPreview();
                    }}
                  >
                    Continue to Page
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button variant="noborder" onClick={onSave}>
          <Save className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  );
};

export default SectionFooter;

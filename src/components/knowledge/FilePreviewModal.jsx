import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function FilePreviewModal({ isOpen, onClose, title, url }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 bg-muted/30 relative">
          {url ? (
            <iframe 
              src={url} 
              className="w-full h-full border-none"
              title="File Preview"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No file available to preview.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

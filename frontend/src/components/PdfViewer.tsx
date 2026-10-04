interface Props {
  fileUrl: string;
}

export function PdfViewer({ fileUrl }: Props) {
  return (
    <div className="h-full flex flex-col bg-neutral-100">
      <iframe
        src={fileUrl}
        title="Invoice PDF"
        className="flex-1 w-full border-0 bg-white"
      />
    </div>
  );
}
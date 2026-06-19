import { useEffect, useState, type JSX } from "react";
import { X, ZoomIn, ZoomOut, Expand, Download } from "lucide-react";
import { Button } from "@/shared/components/ui/Button";

export interface ImageModalProps {
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export function ImageModal({
  imageUrl,
  title,
  onClose,
}: ImageModalProps): JSX.Element {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDownloading, setIsDownloading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling while open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setIsDownloading(true);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      const safeTitle = title
        ? title.replace(/[^a-z0-9]/gi, "_").toLowerCase()
        : "image";
      link.download = `${safeTitle}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Failed to download image:", error);
      alert("Failed to download image. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));
  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
    const zoomSensitivity = 0.05;
    const delta = e.deltaY < 0 ? zoomSensitivity : -zoomSensitivity;
    setScale((prev) => Math.min(Math.max(0.5, prev + delta), 5));
  };

  // Pan controls
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity"
      onClick={onClose}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
    >
      {/* Top right actions */}
      <div className="absolute right-4 top-4 z-50 flex items-center gap-2">
        <Button
          variant="ghost"
          size="md"
          title="Download"
          onClick={handleDownload}
          isLoading={isDownloading}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          {!isDownloading && <Download className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="md"
          title="Close"
          onClick={onClose}
          className="text-white/70 hover:bg-white/10 hover:text-white"
        >
          <X className="h-6 w-6" />
        </Button>
      </div>

      {/* Bottom Zoom Controls */}
      <div
        className="absolute bottom-6 z-50 flex items-center gap-2 rounded-full bg-black/50 px-4 py-2 backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="sm"
          title="Zoom Out"
          onClick={handleZoomOut}
          className="h-8 w-8 px-0 text-white hover:bg-white/20"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <span className="w-12 text-center text-xs font-medium text-white">
          {Math.round(scale * 100)}%
        </span>
        <Button
          variant="ghost"
          size="sm"
          title="Zoom In"
          onClick={handleZoomIn}
          className="h-8 w-8 px-0 text-white hover:bg-white/20"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-4 w-[1px] bg-white/30" />
        <Button
          variant="ghost"
          size="sm"
          title="Reset"
          onClick={handleReset}
          className="h-8 w-8 px-0 text-white hover:bg-white/20"
        >
          <Expand className="h-4 w-4" />
        </Button>
      </div>

      {/* Image Container */}
      <div
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt={title}
          draggable={false}
          onPointerDown={handlePointerDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            cursor: isDragging ? "grabbing" : scale > 1 ? "grab" : "default",
            transition: isDragging ? "none" : "transform 0.1s ease-out",
          }}
          className="max-h-[85vh] max-w-full origin-center rounded-md object-contain shadow-2xl"
        />
        {title && (
          <p className="absolute bottom-20 text-sm font-medium text-white/90 drop-shadow-md">
            {title}
          </p>
        )}
      </div>
    </div>
  );
}

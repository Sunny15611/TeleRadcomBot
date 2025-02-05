

"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DocumentListProps {
  Documents?: string[];
}

const DocumentList: React.FC<DocumentListProps> = ({ Documents }) => {
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedDocument) {
      setIsLoading(true);
    }
  }, [selectedDocument]);

  if (!Documents || !Documents.length) {
    return null;
  }

  const handleDocumentClick = (document: string) => {
    setSelectedDocument(document);
  };

  const closePopup = () => {
    setSelectedDocument(null);
  };

  const generateDocumentUrl = (item: string): string => {
    const startIndex = item.indexOf("Document Number:");
    if (startIndex === -1) return "";
    const endIndex = item.indexOf("Section Title:");
    const documentNumberPart = item.substring(
      startIndex + "Document Number:".length,
      endIndex !== -1 ? endIndex : undefined
    );
    const documentNumberMatch = documentNumberPart.match(/TS \d+\.\d+/);
    if (documentNumberMatch) {
      const documentKey = documentNumberMatch[0].replace("TS", "TS").replace(" ", "+");
      return `https://sunny3ggp123.s3.ap-south-1.amazonaws.com/${documentKey}`;
    }
    return "";
  };

  const getGoogleDocsViewerUrl = (documentUrl: string) => {
    const googleDocsViewerBaseUrl = "https://docs.google.com/viewer?url=";
    return `${googleDocsViewerBaseUrl}${encodeURIComponent(documentUrl)}&embedded=true`;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      {Documents.length > 0 && (
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Related Documents
        </h2>
      )}

      <ul className="space-y-2">
        {Documents.map((item, index) => (
          <li
            key={index}
            className="bg-gray-50 hover:bg-gray-100 rounded-md p-3 transition duration-150 ease-in-out"
          >
            <a
              href="#"
              className="text-purple-600 hover:text-blue-800 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                handleDocumentClick(item);
              }}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <Dialog open={!!selectedDocument} onOpenChange={closePopup}>
        <DialogContent className="sm:max-w-[70vw] sm:max-h-[100vh]">
          <DialogHeader>
            <DialogTitle>{selectedDocument}</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="mt-4 h-full">
              {isLoading && (
                <div className="absolute inset-0 flex flex-col justify-center items-center bg-gray-100 space-y-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="text-purple-700 text-lg">
                    Loading document preview...
                  </p>
                </div>
              )}  
              <iframe
                src={getGoogleDocsViewerUrl(generateDocumentUrl(selectedDocument))}
                width="100%"
                height="1000px"
                style={{ 
                  border: "none", 
                  visibility: isLoading ? "hidden" : "visible",
                  position: "relative",
                  top: 0,
                  left: 0
                }}
                title="Document Viewer"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentList;
//generateDocumentUrl(selectedDocument)





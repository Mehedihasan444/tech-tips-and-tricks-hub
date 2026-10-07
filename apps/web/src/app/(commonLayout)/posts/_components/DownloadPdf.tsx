"use client";
import { TPost } from "@/types/TPost";
import { Button } from "@heroui/react";
import React, { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

const DownloadPdf = ({ post }: { post: TPost }) => {
  const [isBusy, setIsBusy] = useState(false);
  // Lazy-load the ~1MB pdfmake bundle only when the user actually downloads,
  // keeping the post-detail page JS small.
  const loadPdfMake = async () => {
    const [{ default: pdfMake }, { default: pdfFonts }] = await Promise.all([
      import("pdfmake/build/pdfmake"),
      import("pdfmake/build/vfs_fonts"),
    ]);
    // @types/pdfmake types vfs_fonts as a flat string map, but at runtime it
    // exports { pdfMake: { vfs } }. Narrow it to the real shape.
    const fonts = pdfFonts as unknown as { pdfMake: { vfs: Record<string, string> } };
    (pdfMake as unknown as { vfs: Record<string, string> }).vfs = fonts.pdfMake.vfs;
    return pdfMake;
  };
  // Helper function to convert image URL to base64
  const convertImageToBase64 = async (url: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Function to generate and download PDF
  const downloadPdf = async () => {
    if (isBusy) return;
    setIsBusy(true);
    try {
      const pdfMake = await loadPdfMake();
      const images = Array.isArray(post.images) ? post.images : [];
      // Convert all images in the post to base64 (skip failures so one bad
      // image doesn't kill the whole PDF).
      const base64Images = (
        await Promise.all(
          images.map((imageUrl: string) => convertImageToBase64(imageUrl).catch(() => null)),
        )
      ).filter((img): img is string => img !== null);

      const content = [
        { text: post.title, style: "header" },
        {
          text: `Posted by: ${post.author?.name ?? "Unknown"} (${
            post.author?.nickName ?? "unknown"
          }) on ${new Date(post.createdAt).toLocaleDateString()}`,
          style: "subheader",
        },
        { text: " " },
        { text: "Content:", style: "sectionHeader" },
        { text: post.content.replace(/<[^>]+>/g, ""), style: "body" }, // Strips out HTML tags
        { text: " " },
        { text: "Category:", style: "sectionHeader" },
        { text: post.category, style: "body" },
        { text: " " },
        { text: "Tags:", style: "sectionHeader" },
        { text: post.tags.join(", "), style: "body" },
        { text: " " },
        {
          text: `Last updated on: ${new Date(post.updatedAt).toLocaleDateString()}`,
          style: "subheader",
        },
        { text: " " },
        // Add images to the content
        ...base64Images.map((img) => ({ image: img, width: 500 })), // Set desired width for images
      ];

      const docDefinition = {
        content,
        styles: {
          header: {
            fontSize: 22,
            bold: true,
          },
          subheader: {
            fontSize: 16,
            italics: true,
          },
          sectionHeader: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 5] as [number, number, number, number], // Correct type for margins
          },
          body: {
            fontSize: 14,
          },
        },
      };

      const safeTitle = (post.title ?? "post").replace(/[^\w\- ]+/g, "").trim() || "post";
      pdfMake.createPdf(docDefinition).download(`${safeTitle}.pdf`);
    } catch {
      toast.error("Could not generate the PDF. Please try again.");
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <section className="flex justify-center">
      <Button
        onPress={downloadPdf}
        isLoading={isBusy}
        isDisabled={isBusy}
        variant="bordered"
        color="success"
        endContent={!isBusy && <Download />}
      >
        {isBusy ? "Preparing PDF..." : "Download as PDF"}
      </Button>
    </section>
  );
};

export default DownloadPdf;

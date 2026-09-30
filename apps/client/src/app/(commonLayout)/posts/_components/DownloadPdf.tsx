"use client";
import { TPost } from "@/types/TPost";
import { Button } from "@nextui-org/react";
import React from "react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { Download } from "lucide-react";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DownloadPdf = ({ post }: { post: TPost }) => {
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
    // Convert all images in the post to base64
    const imagePromises = post.images.map((imageUrl: string) =>
      convertImageToBase64(imageUrl)
    );

    const base64Images = await Promise.all(imagePromises);

    const content = [
      { text: post.title, style: "header" },
      {
        text: `Posted by: ${post.author.name} (${
          post.author.nickName
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
        text: `Last updated on: ${new Date(
          post.updatedAt
        ).toLocaleDateString()}`,
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

    pdfMake.createPdf(docDefinition).download(`${post.title}.pdf`);
  };

  return (
    <section className="flex justify-center">
      <Button
        onPress={downloadPdf}
        variant="bordered"
        color="success"
        endContent={<Download />}
      >
        Download as PDF
      </Button>
    </section>
  );
};

export default DownloadPdf;
